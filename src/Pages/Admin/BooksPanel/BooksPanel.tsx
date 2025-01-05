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
import { deleteBook, fetchCartBooks, fetchCartStates } from "../../../server/api.js";
import PencilIcon from "../../../assets/components/Icons/PencilIcon.tsx";
import { useNavigate } from "react-router-dom";
import { EPath } from "../../../AppPathes.ts";
import { IBook } from "../../Main/ShopPanel/ShopContent/types.ts";
import PlusIcon from "../../../assets/components/Icons/PlusIcon.tsx";
import Input from "../../../assets/components/Input/Input.tsx";
import MagnifierIcon from "../../../assets/components/Icons/MagnifierIcon.tsx";
import Modal from "../../../assets/components/Modal/Modal.tsx";
import { toast } from "sonner";
import { pluralizeWord } from "../OrdersPanel/utils.ts";

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
    const [isModalActiveBtns, setIsModalActiveBtns] = useState<boolean>(true);
    const [modalText, setModalText] = useState<string>("");
    const [sortColumn, setSortColumn] = useState<string | null>("count");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const navigate = useNavigate();

    const sortedBooks = [...books].sort((a: IBook, b: IBook) => {
        if (!sortColumn) return 0;

        let compareValue = 0;
        if (sortColumn === "count") {
            compareValue = a.count - b.count;
        } else if (sortColumn === "dateModified") {
            const [dateA, timeA] = a.dateModified.split(", ");
            const [dayA, monthA, yearA] = dateA.split(".");
            const dateObjA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);

            const [dateB, timeB] = b.dateModified.split(", ");
            const [dayB, monthB, yearB] = dateB.split(".");
            const dateObjB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

            compareValue = dateObjA.getTime() - dateObjB.getTime();
        } else if (sortColumn === "cost") {
            compareValue = a.price - b.price;
        } else if (sortColumn === "author") {
            compareValue = (a.author ?? "").localeCompare(b.author ?? "");
        } else if (sortColumn === "genre") {
            compareValue = a.genre.localeCompare(b.genre);
        } else if (sortColumn === "name") {
            compareValue = a.name.localeCompare(b.name);
        }
        return sortDirection === "asc" ? compareValue : -compareValue;
    });

    const filteredBooks = sortedBooks.filter((book: IBook) =>
        book.name.toLowerCase().includes(input.trim().toLowerCase())
    );

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const handleDelete = async (booksIds: string[]) => {
        try {
            const cartBooks = await fetchCartBooks();
            const cartStates = await fetchCartStates();
            const books_1 = cartBooks.map(record => record.idBook);
            const books_2 = cartStates.map(record => record.idBook);
            const books = Array.from(new Set([...books_1, ...books_2]));
            const even = booksIds.some(id => books.includes(id));
            if (even) {
                setIsModalActiveBtns(false);
                setModalText("Некоторые выбранные книги лежат в корзинах у пользователей или оформлены в заказе. Удаление невозможно.")
            } else {
                setIsModalActiveBtns(true);
                setModalText(`Вы действительно хотите удалить ${checkedItems.length} ${pluralizeWord(checkedItems.length)}?`);
            }
        } catch (error) {
            toast.error("Возникла ошибка при попытке удаления выбранных книг");
        } finally {
            setIsOpenModal(true);
        }
    };

    const handleDeleteBooks = (booksId: string[]) => {
        setIsLoading(true);
        try {
            booksId.forEach(async (id: string) => {
                await deleteBook(id);
            })
            toast.info("Выбранные книги удалены");
        } catch (error) {
            toast.error(`Ошибка при удалении книг: ${error}`);
        } finally {
            setCurrentPage(1);
            setOpenedInfo("");
            setBooks(books.filter((book: IBook) => !booksId.includes(book.id)));
            setCheckedItems([]);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    return (
        <div className={styles.books}>
            {books.length > 0 &&
                <Input
                    className={styles.input}
                    inputClassName={styles.inputWrapper}
                    iconRight={<MagnifierIcon />}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введите название книги"
                />
            }
            {filteredBooks.length > 0 ?
                <>
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
                            <span
                                onClick={() => handleSort("name")}
                                className={clsx(styles.sortField, sortColumn === "name" && styles.sortedField)}
                            >
                                Название
                            </span>
                            <span
                                onClick={() => handleSort("author")}
                                className={clsx(styles.sortField, sortColumn === "author" && styles.sortedField)}
                            >
                                Автор
                            </span>
                            <span
                                onClick={() => handleSort("genre")}
                                className={clsx(styles.sortField, sortColumn === "genre" && styles.sortedField)}
                            >
                                Жанр
                            </span>
                            <span
                                onClick={() => handleSort("cost")}
                                className={clsx(styles.sortField, sortColumn === "cost" && styles.sortedField)}
                            >
                                Цена
                            </span>
                            <span>Изменено</span>
                        </div>
                        {filteredBooks
                            .slice(currentPage * booksPerPage - booksPerPage, currentPage * booksPerPage)
                            .map(({ id, author, count, idAdmin, name, price, category, genre, pagesCount, weight, imgLink, coverType }: IBook, index: number) => {
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
                                            <span style={{ paddingTop: "10px" }}>{filteredBooks.findIndex((book: IBook) => book.id === id) + 1}</span>
                                            <img
                                                className={clsx(
                                                    styles.productImage,
                                                    count === 0 && styles["productImage-clear"],
                                                )}
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
                                                <span>Количество:
                                                    <span className={styles.bolder}>{count !== 0 ? count : "Нет в наличии"}</span>
                                                </span>
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
                </>
                :
                <span className={styles.zeroResult}>Ничего не найдено</span>
            }
            <div className={styles.btns}>
                <ButtonAdmin
                    className={styles.createBtn}
                    onClick={() => navigate(EPath.adminBook)}
                    rightIcon={<PlusIcon />}
                    text="Создать"
                />
                <ButtonAdmin
                    className={styles.deleteBtn}
                    onClick={() => checkedItems.length === 0 ? toast.warning("Выберите книги") : handleDelete(checkedItems)}
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
                okFunction={() => handleDeleteBooks(checkedItems)}
            />
        </div>
    )
}

export default BooksPanel;