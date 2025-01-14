import React, { useEffect, useState } from "react";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./BookForm.module.scss";
import { IBookForm, IErrors } from "./types.ts";
import { IBook, TCover } from "../../../Main/ShopPanel/ShopContent/types.ts";
import Loader from "../../../../assets/components/Loader/Loader.tsx";
import { addBook, editBook, fetchCartBooks, updateCartBookCount } from "../../../../server/api.js";
import { EPath } from "../../../../AppPathes.ts";
import { v4 as uuidv4 } from 'uuid';
import ButtonAdmin from "../../../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import ArrowLeftOutlineIcon from "../../../../assets/components/Icons/ArrowLeftOutlineIcon.tsx";
import { IAuthor, IFullProfile } from "../../../../types.ts";
import PencilIcon from "../../../../assets/components/Icons/PencilIcon.tsx";
import DropDown from "../../../../assets/components/DropDown/DropDown.tsx";
import { IListOption } from "../../../../assets/components/DropDown/types.ts";
import Input from "../../../../assets/components/Input/Input.tsx";
import { ETabTitle } from "../../enums.ts";
import { initialBook, initialErrors, trimBookInfo } from "./utils.ts";
import { toast } from "sonner";
import { ICartBook } from "../../../Cart/types.ts";

const BookForm: FC<IBookForm> = ({
    books,
    setBooks,
    authors,
    users,
    currentAdmin,
    isLoading,
    setIsLoading,
    productsInCart,
    setProductsInCart,
}) => {
    const { id = "" } = useParams<string>();
    const navigate = useNavigate();
    const [initialBookInfo, setInitialBookInfo] = useState<IBook>({ ...initialBook });
    const [bookInfo, setBookInfo] = useState<IBook>({ ...initialBook });
    const [errors, setErrors] = useState<IErrors>({ ...initialErrors });

    const sortedAuthors = [...authors].sort((a: IAuthor, b: IAuthor) => a.surname.localeCompare(b.surname));

    const { idAuthor, count, idAdmin, dateModified, name, price, category, genre, pagesCount, weight, imgLink, coverType } = bookInfo;
    const prevAdmin = users.find((user: IFullProfile) => user.idUser === idAdmin);

    const isBookChanged = JSON.stringify(initialBookInfo) !== JSON.stringify(bookInfo);

    const validate = (book: IBook): boolean => {
        const { name, price, category, genre, pagesCount, imgLink, weight } = book;
        const newErrors = { ...initialErrors };
        let isValid = true;

        if (name.trim() === "") {
            newErrors.name = "Имя не может быть пустым";
            isValid = false;
        } else if (name.trim().length < 2 || name.trim().length > 255) {
            newErrors.name = "Длина имени: 2-255 символов";
            isValid = false;
        }

        if (category.trim() === "") {
            newErrors.category = "Категория не может быть пустой";
            isValid = false;
        } else if (category.trim().length < 2 || category.trim().length > 50) {
            newErrors.category = "Длина категории: 2-50 символов";
            isValid = false;
        }

        if (genre.trim() === "") {
            newErrors.genre = "Жанр не может быть пустым";
            isValid = false;
        } else if (genre.trim().length < 2 || genre.trim().length > 50) {
            newErrors.genre = "Длина жанра: 2-50 символов";
            isValid = false;
        }

        if (!!count && count < 0) {
            newErrors.count = "Количество не может быть отрицательным";
            isValid = false;
        } else if (count % 1 !== 0) {
            newErrors.count = "Количество не может быть нецелым";
            isValid = false;
        }

        if (price === 0 || price.toString() === "") {
            newErrors.price = "Укажите цену";
            isValid = false;
        } else if (price < 0) {
            newErrors.price = "Цена не может быть отрицательной";
            isValid = false;
        }

        if (!!weight && weight < 0) {
            newErrors.weight = "Вес не может быть отрицательным";
            isValid = false;
        }

        if (imgLink.trim() === "") {
            newErrors.imgLink = "Укажите ссылку на изображение";
            isValid = false;
        }

        if (!!pagesCount && pagesCount % 1 !== 0) {
            newErrors.pagesCount = "Укажите целое число страниц";
            isValid = false;
        } else if (!!pagesCount && pagesCount < 0) {
            newErrors.pagesCount = "Кол-во страниц не может быть отрицательным";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleManipulateBook = async () => {
        const newId = uuidv4();
        const modifyDate = (new Date()).toLocaleString();
        const trimmedBookInfo = trimBookInfo(bookInfo);
        const isValid = validate(trimmedBookInfo);

        const { id, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType, count } = trimmedBookInfo;
        const nullIdAuthor = !!idAuthor ? idAuthor : null;
        const nullCoverType = !!coverType ? coverType : null;
        const nullPagesCount = !!pagesCount ? pagesCount : null;
        const nullWeight = !!weight ? weight : null;

        try {
            if (isValid) {
                setIsLoading(true);
                if (!!id) {
                    await editBook(id, currentAdmin.idUser, count, modifyDate, name, price, category, genre, imgLink, nullIdAuthor, nullPagesCount, nullWeight, nullCoverType);
                    const carts = await fetchCartBooks();
                    const cartBooks = carts.filter(cart => cart.idBook === id);

                    for (const { idCart, idBook, bookCount } of cartBooks) {
                        if (bookCount > count) {
                            const newCount = count === 0 ? 1 : count;
                            await updateCartBookCount(idCart, idBook, newCount);

                            if (idCart === currentAdmin.idCart) {
                                setProductsInCart(productsInCart.map((cartBook: ICartBook) =>
                                    cartBook.book.id === idBook ?
                                        { ...cartBook, count: newCount } :
                                        cartBook
                                ));
                            }
                        }
                    }
                    setBooks(books.map((book: IBook) => {
                        if (book.id !== id) {
                            return book;
                        }
                        return {
                            ...trimmedBookInfo,
                            dateModified: modifyDate,
                            idAdmin: currentAdmin.idUser,
                        };
                    }));
                    toast.success("Информация о книге отредактирована");
                } else {
                    await addBook(newId, currentAdmin.idUser, count, modifyDate, name, price, category, genre, imgLink, nullIdAuthor, nullPagesCount, nullWeight, nullCoverType);
                    setBooks([...books, {
                        ...trimmedBookInfo,
                        id: newId,
                        dateModified: modifyDate,
                        idAdmin: currentAdmin.idUser,
                    }]);
                    toast.success("Запись о новой книге создана");
                }
            } else {
                toast.error("Заполните все поля правильно");
            }
        } catch (error) {
            toast.error(`Ошибка при ${!!id ? "редактировании" : "создании"} книги:`, error);
        } finally {
            if (isValid) {
                !!id ? navigate(`${EPath.admin}?tab=${ETabTitle.books}`) : navigate(`${EPath.adminBook}/${newId}`);
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const currentBook = books.find((book: IBook) => book.id === id);
        if (!!currentBook) {
            const changedFieldsBook = Object.fromEntries(
                Object.entries(currentBook).map(([key, value]) => [key,
                    key === "idAuthor" || key === "coverType" ?
                        (value === null ? "" : value) :
                        (key === "pagesCount" || key === "weight" ?
                            (value === null ? 0 : value) :
                            value
                        )
                ])
            ) as IBook;
            setBookInfo({ ...changedFieldsBook });
            setInitialBookInfo({ ...changedFieldsBook });
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [id, books]);

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.formWrapper}>
                <div>
                    <ButtonAdmin
                        text='Назад'
                        leftIcon={<ArrowLeftOutlineIcon />}
                        onClick={() => navigate(`${EPath.admin}?tab=${ETabTitle.books}`)}
                        type={"gray"}
                    />
                </div>
                <div className={styles.formTitle}>
                    <span className={styles.title}>{!!id ? `Редактирование книги №${id}` : "Создание новой записи"}</span>
                </div>
                {prevAdmin &&
                    <div className={styles.modifyWrapper}>
                        <span>Последнее редактирование: {prevAdmin.name} {prevAdmin.surname}, {dateModified}</span>
                        <PencilIcon color='var(--gray-purple)' height={11} />
                    </div>
                }
                <div className={styles.wrapper}>
                    <div className={styles.fieldsWrapper}>
                        <Input
                            label="Название"
                            placeholder="Укажите название книги"
                            requiredField
                            value={name}
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, name: e.target.value });
                                setErrors({ ...errors, name: "" });
                            }}
                            errorMessage={errors.name}
                        />
                        <Input
                            label="Категория"
                            placeholder="Укажите категорию книги"
                            requiredField
                            value={category}
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, category: e.target.value });
                                setErrors({ ...errors, category: "" });
                            }}
                            errorMessage={errors.category}
                        />
                        <Input
                            label="Жанр"
                            placeholder="Укажите жанр книги"
                            requiredField
                            value={genre}
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, genre: e.target.value });
                                setErrors({ ...errors, genre: "" });
                            }}
                            errorMessage={errors.genre}
                        />
                        <Input
                            label="Цена"
                            placeholder="Укажите цену книги"
                            type={"number"}
                            requiredField
                            value={price.toString()}
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, price: Number(e.target.value) });
                                setErrors({ ...errors, price: "" });
                            }}
                            errorMessage={errors.price}
                        />
                        <Input
                            label="Книг доступно"
                            placeholder="Укажите количество доступных к заказу книг"
                            type={"number"}
                            requiredField
                            value={count.toString()}
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, count: Number(e.target.value) });
                                setErrors({ ...errors, count: "" });
                            }}
                            errorMessage={errors.count}
                        />
                        <Input
                            label="Ссылка на изображение"
                            placeholder="Укажите действующую ссылку"
                            requiredField
                            value={imgLink}
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, imgLink: e.target.value });
                                setErrors({ ...errors, imgLink: "" });
                            }}
                            errorMessage={errors.imgLink}
                        />
                        <DropDown
                            label="Автор"
                            placeholder="Укажите автора книги"
                            listOfOptions={sortedAuthors.map(({ id, name, surname }: IAuthor) => ({
                                label: `${surname} ${name}`,
                                value: id,
                            }))}
                            valuesToSelect={!!idAuthor ? [idAuthor] : []}
                            clearOption
                            searchOption
                            listClassName={styles.dropdownList}
                            onOptionChange={(opt: IListOption) => setBookInfo({ ...bookInfo, idAuthor: !!opt.value ? opt.value : "" })}
                        />
                        <DropDown
                            label="Обложка"
                            placeholder="Укажите тип обложки книги"
                            listOfOptions={[
                                { label: "Мягкая", value: "Мягкая" },
                                { label: "Твердая", value: "Твердая" },
                            ]}
                            valuesToSelect={!!coverType ? [coverType] : []}
                            clearOption
                            listClassName={styles.dropdownList}
                            onOptionChange={(opt: IListOption) => setBookInfo({ ...bookInfo, coverType: !!opt.value ? opt.value as TCover : "" })}
                        />
                        <Input
                            label="Количество страниц"
                            placeholder="Укажите количество страниц книги"
                            type={"number"}
                            value={!!pagesCount ? pagesCount.toString() : ""}
                            onChange={(e) => {
                                setBookInfo({ ...bookInfo, pagesCount: !!Number(e.target.value) ? Number(e.target.value) : 0 });
                                setErrors({ ...errors, pagesCount: "" });
                            }}
                            errorMessage={errors.pagesCount}
                        />
                        <Input
                            label="Вес (г.)"
                            placeholder="Укажите вес книги"
                            type={"number"}
                            value={!!weight ? weight.toString() : ""}
                            onChange={(e) => setBookInfo({ ...bookInfo, weight: !!Number(e.target.value) ? Number(e.target.value) : 0 })}
                            errorMessage={errors.weight}
                        />
                    </div>
                    {/* TO-DO: сделать что-то с тем, что фото книги нет */}
                    <div className={styles.imgWrapper}>
                        {imgLink &&
                            <img
                                className={styles.image}
                                src={imgLink}
                                alt={name}
                            />
                        }
                    </div>
                </div>
                <div className={styles.btnsWrapper}>
                    <ButtonAdmin
                        text='Сохранить'
                        onClick={() => !!id ? (isBookChanged ? handleManipulateBook() : toast.warning("Нет изменений для сохранения")) : handleManipulateBook()}
                        type={"purple"}
                        fill={"outline"}
                        disabled={!!id ? !isBookChanged : false}
                    />
                    {isBookChanged &&
                        <ButtonAdmin
                            text='Отменить'
                            onClick={() => {
                                setBookInfo({ ...initialBookInfo });
                                setErrors({ ...initialErrors });
                            }}
                            type={"gray"}
                        />
                    }
                </div>
            </div>
        )
    );
}

export default BookForm;