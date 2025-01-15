import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IBook } from "../Main/ShopPanel/ShopContent/types";
import { ICartBook } from "../Cart/types";
import { addBookToCart } from "../../server/api";
import { toast } from "sonner";
import styles from './Book.module.scss';
import { IBookPage } from "./types";
import { initialBook, pluralizeWord } from "./utils.ts";
import Loader from "../../assets/components/Loader/Loader.tsx";
import clsx from "clsx";
import { EPath } from "../../AppPathes.ts";
import ButtonAdmin from "../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import ArrowLeftOutlineIcon from "../../assets/components/Icons/ArrowLeftOutlineIcon.tsx";
import CheckmarkIcon from "../../assets/components/Icons/CheckmarkIcon.tsx";
import CrossIcon from "../../assets/components/Icons/CrossIcon.tsx";

const Book: FC<IBookPage> = ({
    cartId,
    productsInCart,
    setProductsInCart,
    books,
    isLoading,
    setIsLoading,
}) => {
    const { id = "" } = useParams<string>();
    const navigate = useNavigate();
    const [book, setBook] = useState<IBook>({ ...initialBook });
    const { author, count, name, price, category, genre, pagesCount, weight, imgLink, coverType } = book;
    const isBookInCart = productsInCart.some(({ book: product }: ICartBook) => book.id === product.id);

    const loadBookInfo = () => {
        try {
            setIsLoading(true);
            const book = books.find((book: IBook) => book.id === id);
            if (!!book) {
                setBook(book);
            }
        } catch (error) {
            toast.error('Ошибка при загрузке данных книги');
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 0);
        }
    }

    const handleAddBookToCart = async (book: IBook) => {
        const currentDate = (new Date()).toLocaleString();
        const newBook: ICartBook = {
            book,
            count: 1,
            date: currentDate,
        }
        setIsLoading(true);
        setProductsInCart([...productsInCart, newBook]);
        if (!!cartId) {
            await addBookToCart(cartId, book.id, 1, currentDate);
        }
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Книга добавлена в корзину');
        }, !!cartId ? 500 : 200);
    }

    useEffect(() => {
        loadBookInfo();
    }, [id, books]);

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.bookWrapper}>
                <div className={styles.book}>
                    <div className={styles.bookMain}>
                        <ButtonAdmin
                            text='Назад'
                            leftIcon={<ArrowLeftOutlineIcon />}
                            onClick={() => navigate(-1)}
                            type={"gray"}
                            className={styles.backBtn}
                        />
                        <span className={styles.name}>{name}</span>
                        {!!author && <span className={styles.author}>{author}</span>}
                    </div>
                    <div className={styles.bookInfo}>
                        <div className={styles.imgWrapper}>
                            <img
                                className={clsx(
                                    styles.image,
                                    count === 0 && styles.translucent,
                                )}
                                src={imgLink}
                                alt={name}
                            />
                        </div>
                        <div className={styles.info}>
                            <p className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at&nbsp;varius elit, volutpat rhoncus tellus. Donec dui felis, fermentum at&nbsp;iaculis vitae, feugiat quis quam. Nam fermentum eros erat, a&nbsp;hendrerit tortor ultricies&nbsp;a. Vestibulum ante ipsum primis in&nbsp;faucibus orci luctus et&nbsp;ultrices posuere cubilia curae; Etiam sodales malesuada&nbsp;ex, sit amet sodales nisl faucibus&nbsp;eu. Duis varius egestas nisi non tempor. Proin cursus augue vitae felis condimentum, ut&nbsp;consequat sapien egestas. Ut&nbsp;bibendum in&nbsp;nunc non elementum.</p>
                            <div className={styles.main}>
                                <span className={styles.infoTitle}>Основные характеристики:</span>
                                <div className={styles.specifications}>
                                    <div className={styles.specificationCol}>
                                        <span>Жанр</span>
                                        <span>Категория</span>
                                        {!!pagesCount && <span>Количество страниц</span>}
                                        {!!weight && <span>Вес</span>}
                                        {!!coverType && <span>Тип обложки</span>}
                                    </div>
                                    <div className={styles.specificationCol}>
                                        <span className={styles.bolder}>{genre}</span>
                                        <span className={styles.bolder}>{category}</span>
                                        {!!pagesCount && <span className={styles.bolder}>{pagesCount}</span>}
                                        {!!weight && <span className={styles.bolder}>{weight}</span>}
                                        {!!coverType && <span className={styles.bolder}>{coverType}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.cart}>
                            <span className={styles.price}>{price} ₽</span>
                            {count > 0 &&
                                <button
                                    className={clsx(
                                        styles.addToCartBtn,
                                        isBookInCart && styles["addToCartBtn-pressed"],
                                    )}
                                    onClick={() => isBookInCart ? navigate(EPath.cart) : handleAddBookToCart(book)}
                                >
                                    {isBookInCart ? "Оформить" : "Купить"}
                                </button>
                            }
                            <div className={styles.access}>
                                <div className={styles.availability}>
                                    {count === 0 ?
                                        <CrossIcon color="var(--warning-color)" /> :
                                        <CheckmarkIcon color={count < 3 ? "var(--warning-color-2)" : "var(--order-ready-color)"} />
                                    }
                                    <span
                                        className={count === 0 ?
                                            styles["out-of-stock"] :
                                            (count < 3 ? styles["almost-over"] : styles["in-stock"])
                                        }
                                    >
                                        {count === 0 ?
                                            "Нет в наличии" :
                                            (count < 3 ? "Почти закончилась" : "В наличии")
                                        }
                                    </span>
                                </div>
                                {count > 0 &&
                                    <span className={styles.count}>({count} {pluralizeWord(count)} на складе)</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottomLine}></div>
                </div>
            </div>
        )
    )
}

export default Book;