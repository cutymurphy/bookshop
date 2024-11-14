import React, { useState } from "react";
import { FC } from "react";
import { IBooksPanel } from "./types";
import styles from "./BooksPanel.module.scss";
import clsx from "clsx";
import { IFullProfile } from "../../../types";
import ArrowDownOutlineIcon from "../../../assets/components/Icons/ArrowDownOutlineIcon.tsx";
import Pagination from "../../../assets/components/Pagination/Pagination.tsx";
import { EPaginationPage } from "../../../assets/components/Pagination/enum.ts";
import Checkbox from "../../../assets/components/Checkbox/Checkbox.tsx";
import TrashBinIcon from "../../../assets/components/Icons/TrashBinIcon.tsx";
import ButtonAdmin from "../../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import { deleteBook } from "../../../server/api.js";
import PencilIcon from "../../../assets/components/Icons/PencilIcon.tsx";
import { useNavigate } from "react-router-dom";
import { EPath } from "../../../AppPathes.ts";
import { IBook } from "../../Main/ShopPanel/ShopContent/types.ts";
import PlusIcon from "../../../assets/components/Icons/PlusIcon.tsx";
import Input from "../../../assets/components/Input/Input.tsx";
import MagnifierIcon from "../../../assets/components/Icons/MagnifierIcon.tsx";
import Modal from "../../../assets/components/Modal/Modal.tsx";

const BooksPanel: FC<IBooksPanel> = ({
    books,
    setBooks,
    users,
    setIsLoading,
}) => {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    const [openedInfo, setOpenedInfo] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(10);
    const [isModalOpen, setIsOpenModal] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const sortedBooks = books.sort((a: IBook, b: IBook) => {
        const [dateA, timeA] = a.dateModified.split(", ");
        const [dayA, monthA, yearA] = dateA.split(".");
        const dateObjA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);

        const [dateB, timeB] = b.dateModified.split(", ");
        const [dayB, monthB, yearB] = dateB.split(".");
        const dateObjB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

        return dateObjB.getTime() - dateObjA.getTime();
    });

    const filteredBooks = sortedBooks.filter((book: IBook) =>
        book.name.toLowerCase().includes(input.trim().toLowerCase())
    );

    const handleDeleteBooks = (booksId: string[]) => {
        /* TO-DO: пофиксить удаление, если книга состоит в каких-то таблицах (и другое похожее глянуть) */
        setIsLoading(true);
        try {
            booksId.forEach(async (id: string) => {
                await deleteBook(id);
            })
        } catch (error) {
            console.error(`Ошибка при удалении книг: ${error}`);
        } finally {
            setCurrentPage(1);
            setOpenedInfo("");
            setBooks(books.filter((book: IBook) => !booksId.includes(book.id)));
            setCheckedItems([]);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    }

    return (
        <div className={styles.books}>
            <Input
                className={styles.input}
                inputClassName={styles.inputWrapper}
                iconRight={<MagnifierIcon />}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите название книги"
            />
            <div className={styles.booksTable}>
                <div className={clsx(styles.booksRow, styles.headerRow)}>
                    <Checkbox
                        id="commonCheckbox-books"
                        onChange={() => checkedItems.length === books.length ?
                            setCheckedItems([]) :
                            setCheckedItems(books.map((book: IBook) => book.id))
                        }
                        checked={checkedItems.length === books.length}
                        className={clsx(styles.checkbox, styles.mainCheckbox)}
                        classNameLabel={styles.checkboxLabel}
                    />
                    <span>№</span>
                    <span>Изображение</span>
                    <span>Название</span>
                    <span>Автор</span>
                    <span>Жанр</span>
                    <span>Цена</span>
                    <span>Изменено</span>
                </div>
                {filteredBooks
                    .slice(currentPage * booksPerPage - booksPerPage, currentPage * booksPerPage)
                    .map(({ id, author, idAdmin, name, price, category, genre, pagesCount, weight, imgLink, coverType }: IBook, index: number) => {
                        const admin = users.find((user: IFullProfile) => user.idUser === idAdmin);

                        return (
                            <div
                                className={clsx(
                                    styles.rowWrapper,
                                    index % 2 !== 0 && styles.borderPurple,
                                )}
                                key={id}
                            >
                                <div
                                    className={clsx(styles.booksRow, styles.mainRow)}
                                    onClick={() => { openedInfo === id ? setOpenedInfo("") : setOpenedInfo(id) }}
                                >
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
                                    <span style={{ paddingTop: "10px" }}>{books.findIndex((book: IBook) => book.id === id) + 1}</span>
                                    <img
                                        className={styles.productImage}
                                        src={imgLink}
                                        alt={name}
                                    />
                                    <span className={styles.rowPadding}>{name}</span>
                                    <span className={styles.rowPadding}>{!!author ? author : "—"}</span>
                                    <span className={styles.rowPadding}>{genre}</span>
                                    <span className={styles.rowPadding}>{price}</span>
                                    <span className={styles.rowPadding}>{admin ? `${admin.name} ${admin.surname}` : "—"}</span>

                                    <div className={styles.iconsWrapper}>
                                        <span
                                            className={clsx(
                                                styles.rowIcon,
                                                openedInfo === id && styles["rowIcon-opened"],
                                            )}
                                            onClick={() => { openedInfo === id ? setOpenedInfo("") : setOpenedInfo(id) }}
                                        >
                                            <ArrowDownOutlineIcon />
                                        </span>
                                        <span
                                            className={clsx(styles.rowIcon, styles.pencilIcon)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`${EPath.adminBook}/${id}`);
                                            }}
                                        >
                                            <PencilIcon />
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={clsx(
                                        styles.rowInfo,
                                        openedInfo === id && styles["rowInfo-opened"],
                                    )}
                                >
                                    <div className={styles.rowInfoColInfo}>
                                        <span>Категория:
                                            <span className={styles.bolder}>{category}</span>
                                        </span>
                                        {!!pagesCount &&
                                            <span>Количество страниц:
                                                <span className={styles.bolder}>{pagesCount}</span>
                                            </span>
                                        }
                                        {!!weight &&
                                            <span>Вес:
                                                <span className={styles.bolder}>{weight} г.</span>
                                            </span>
                                        }
                                        {!!coverType &&
                                            <span>Тип обложки:
                                                <span className={styles.bolder}>{coverType}</span>
                                            </span>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={booksPerPage}
                setItemsPerPage={setBooksPerPage}
                currentItems={filteredBooks}
                type={EPaginationPage.admin}
                resultsClassName={styles.paginator}
                paginationClassName={styles.paginator}
            />
            <div className={styles.btns}>
                <ButtonAdmin
                    className={styles.createBtn}
                    onClick={() => navigate(EPath.adminBook)}
                    rightIcon={<PlusIcon />}
                    text="Создать"
                />
                <ButtonAdmin
                    className={styles.deleteBtn}
                    onClick={() => checkedItems.length === 0 ? alert("Выберите заказы") : setIsOpenModal(true)}
                    disabled={checkedItems.length === 0}
                    rightIcon={<TrashBinIcon />}
                    text="Удалить"
                />
            </div>
            <Modal
                isOpen={isModalOpen}
                setIsOpen={setIsOpenModal}
                okFunction={() => handleDeleteBooks(checkedItems)}
            />
        </div>
    )
}

export default BooksPanel;