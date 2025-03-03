import React, { useEffect, useState } from "react";
import { FC } from "react";
import styles from "./AuthorsPanel.module.scss";
import clsx from "clsx";
import { IAuthor } from "../../../types.ts";
import Pagination from "../../../assets/components/Pagination/Pagination.tsx";
import { EPaginationPage } from "../../../assets/components/Pagination/enum.ts";
import Checkbox from "../../../assets/components/Checkbox/Checkbox.tsx";
import TrashBinIcon from "../../../assets/components/Icons/TrashBinIcon.tsx";
import ButtonAdmin from "../../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import { deleteAuthor } from "../../../server/api.js";
import { IAuthorsPanel, TSortColumn } from "./types.ts";
import Modal from "../../../assets/components/Modal/Modal.tsx";
import { toast } from "sonner";
import { pluralizeWord } from "../OrdersPanel/utils.ts";
import { IBook } from "../../Main/ShopPanel/ShopContent/types.ts";
import Input from "../../../assets/components/Input/Input.tsx";
import MagnifierIcon from "../../../assets/components/Icons/MagnifierIcon.tsx";
import { useNavigate } from "react-router-dom";
import { EPath } from "../../../AppPathes.ts";
import PlusIcon from "../../../assets/components/Icons/PlusIcon.tsx";
import PencilIcon from "../../../assets/components/Icons/PencilIcon.tsx";

const AuthorsPanel: FC<IAuthorsPanel> = ({
    authors,
    setAuthors,
    books,
    setIsLoading,
}) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [authorsPerPage, setAuthorsPerPage] = useState<number>(10);
    const [isModalOpen, setIsOpenModal] = useState<boolean>(false);
    const [isModalActiveBtns, setIsModalActiveBtns] = useState<boolean>(true);
    const [modalText, setModalText] = useState<string>("");
    const [sortColumn, setSortColumn] = useState<TSortColumn>("dateModified");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [input, setInput] = useState<string>("");
    const navigate = useNavigate();

    const sortedAuthors = [...authors].sort((a: IAuthor, b: IAuthor) => {
        let compareValue = 0;
        if (sortColumn === "dateModified") {
            const [dateA, timeA] = a.dateModified.split(", ");
            const [dayA, monthA, yearA] = dateA.split(".");
            const dateObjA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);

            const [dateB, timeB] = b.dateModified.split(", ");
            const [dayB, monthB, yearB] = dateB.split(".");
            const dateObjB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

            compareValue = dateObjA.getTime() - dateObjB.getTime();
        } else if (sortColumn === "surname") {
            compareValue = a.surname.localeCompare(b.surname);
        } else if (sortColumn === "name") {
            compareValue = a.name.localeCompare(b.name);
        }
        return sortDirection === "asc" ? compareValue : -compareValue;
    });

    const filteredAuthors = sortedAuthors.filter((author: IAuthor) =>
        `${author.name} ${author.surname}`.toLowerCase().includes(input.trim().toLowerCase()) ||
        `${author.surname} ${author.name}`.toLowerCase().includes(input.trim().toLowerCase())
    );

    const handleSort = (column: TSortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const handleDelete = async (authorIds: string[]) => {
        try {
            const booksAuthors = Array.from(new Set(
                books.filter(({ idAuthor }: IBook) => !!idAuthor)
                    .map(({ idAuthor }: IBook) => idAuthor)
            ));
            const even = authorIds.some(id => booksAuthors.includes(id));
            if (even) {
                setIsModalActiveBtns(false);
                setModalText("Некоторые выбранные авторы используются для книг. Удаление невозможно.")
            } else {
                setIsModalActiveBtns(true);
                setModalText(`Вы действительно хотите удалить ${checkedItems.length} ${pluralizeWord(checkedItems.length)}?`);
            }
        } catch (error) {
            toast.error("Возникла ошибка при попытке удаления выбранных авторов");
        } finally {
            setIsOpenModal(true);
        }
    };

    const handleDeleteAuthors = (authorIds: string[]) => {
        setIsLoading(true);
        try {
            authorIds.forEach(async (id: string) => {
                await deleteAuthor(id);
            })
            toast.info("Выбранные авторы удалены");
        } catch (error) {
            toast.error(`Ошибка при удалении авторов: ${error}`);
        } finally {
            setCurrentPage(1);
            setAuthors(authors.filter((author: IAuthor) => !authorIds.includes(author.id)));
            setCheckedItems([]);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [input]);

    return (
        <div className={styles.authors}>
            {authors.length > 0 &&
                <Input
                    className={styles.input}
                    inputClassName={styles.inputWrapper}
                    iconRight={<MagnifierIcon />}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введите имя и(или) фамилию автора"
                />
            }
            {filteredAuthors.length > 0 ?
                <>
                    <div className={styles.authorsTable}>
                        <div className={clsx(styles.authorsRow, styles.headerRow)}>
                            {authors.length > 0 &&
                                <Checkbox
                                    id="commonCheckbox-authors"
                                    onChange={() => checkedItems.length === authors.length ?
                                        setCheckedItems([]) :
                                        setCheckedItems(authors.map((author: IAuthor) => author.id))
                                    }
                                    checked={checkedItems.length === authors.length}
                                    className={styles.checkbox}
                                    classNameLabel={styles.checkboxLabel}
                                />
                            }
                            <span>№</span>
                            <span
                                onClick={() => handleSort("name")}
                                className={clsx(styles.sortField, sortColumn === "name" && styles.sortedField)}
                            >
                                Имя
                            </span>
                            <span
                                onClick={() => handleSort("surname")}
                                className={clsx(styles.sortField, sortColumn === "surname" && styles.sortedField)}
                            >
                                Фамилия
                            </span>
                            <span>Почта</span>
                            <span>Телефон</span>
                        </div>
                        {filteredAuthors
                            .slice(currentPage * authorsPerPage - authorsPerPage, currentPage * authorsPerPage)
                            .map(({ id, name, surname, email, phone }: IAuthor, index: number) => (
                                <div
                                    className={clsx(
                                        styles.rowWrapper,
                                        index % 2 !== 0 && styles.borderPurple,
                                    )}
                                    key={id}
                                >
                                    <div className={styles.authorsRow}>
                                        <Checkbox
                                            id={id}
                                            onChange={() => checkedItems.includes(id) ?
                                                setCheckedItems(checkedItems.filter((item: string) => item !== id)) :
                                                setCheckedItems([...checkedItems, id])
                                            }
                                            checked={checkedItems.includes(id)}
                                            className={styles.checkbox}
                                            classNameLabel={styles.checkboxLabel}
                                        />
                                        <span>{filteredAuthors.findIndex((author: IAuthor) => author.id === id) + 1}</span>
                                        <span className={styles.rowPadding}>{name}</span>
                                        <span className={styles.rowPadding}>{surname}</span>
                                        <span className={styles.rowPadding}>{!!email ? email : "—"}</span>
                                        <span className={styles.rowPadding}>{!!phone ? phone : "—"}</span>
                                        <div className={styles.iconsWrapper}>
                                            <span
                                                className={clsx(styles.rowIcon, styles.pencilIcon)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`${EPath.adminAuthor}/${id}`);
                                                }}
                                            >
                                                <PencilIcon />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={authorsPerPage}
                        setItemsPerPage={setAuthorsPerPage}
                        currentItems={filteredAuthors}
                        type={EPaginationPage.admin}
                        resultsClassName={styles.paginator}
                        paginationClassName={styles.paginator}
                    />
                </>
                :
                <span className={styles.zeroResult}>Ничего не найдено</span>
            }
            <div className={styles.btns}>
                <ButtonAdmin
                    className={styles.createBtn}
                    onClick={() => navigate(EPath.adminAuthor)}
                    rightIcon={<PlusIcon />}
                    text="Создать"
                />
                <ButtonAdmin
                    className={styles.deleteBtn}
                    onClick={() => checkedItems.length === 0 ? toast.warning("Выберите авторов") : handleDelete(checkedItems)}
                    disabled={checkedItems.length === 0}
                    rightIcon={<TrashBinIcon />}
                    text="Удалить"
                />
            </div>
            <Modal
                innerText={modalText}
                activeBtns={isModalActiveBtns}
                isOpen={isModalOpen}
                setIsOpen={setIsOpenModal}
                okFunction={() => handleDeleteAuthors(checkedItems)}
            />
        </div>
    )
}

export default AuthorsPanel;