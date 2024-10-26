import React, { FC, useEffect, useState } from "react";
import { IBook, IShopContent } from "./types";
import styles from './ShopContent.module.scss'
import { Link, useNavigate } from "react-router-dom";
import { EPath } from "../../../../AppPathes.ts";
import clsx from "clsx";
import { EFiltersNames, IFilter } from "../ShopFilters/types.ts";
import { ICartBook } from "../../../Cart/types.ts";

const ShopContent: FC<IShopContent> = ({
    productsInCart,
    setProductsInCart,
    pickedFilters,
    setFilters,
}) => {
    const navigate = useNavigate();

    const createBook = (id: number, name: string, category: string, imgLink: string, price: number): IBook => {
        return {
            id,
            name,
            category,
            imgLink,
            price,
        }
    }

    const listOfBooks = [
        createBook(1, "Зловещий ресторан", "Художественная литература", "https://content.img-gorod.ru/nomenclature/30/172/3017246-4.jpg?width=304&height=438&fit=bounds", 931.99),
        createBook(2, "Хрупкое равновесие. Книга 1", "Художественная литература", "https://content.img-gorod.ru/nomenclature/27/805/2780568.jpg?width=620&height=1000&fit=bounds", 566.99),
        createBook(3, "Мода и сериалы: от Друзей и Твин Пикс до Эйфории и Убивая Еву", "Красота", "https://content.img-gorod.ru/nomenclature/29/472/2947284-3.jpg?width=620&height=1000&fit=bounds", 799.99),
        createBook(4, "Дворец потерянных душ. Наследник Сентерии (#2)", "Манга", "https://books.google.ru/books/publisher/content?id=zJsGEQAAQBAJ&hl=ru&pg=PP1&img=1&zoom=3&bul=1&sig=ACfU3U3DnjZlaaQHS4Vdwj1nX0Vu8cx96A&w=1280", 729.99),
        createBook(5, "Дюна: Дюна. Мессия Дюны. Дети Дюны", "Наука", "https://books.google.ru/books/publisher/content?id=jbA1DwAAQBAJ&hl=ru&pg=PP1&img=1&zoom=3&bul=1&sig=ACfU3U3aWbgnHZBSxNOu6kv5FPSA3-iC_g&w=1280", 1699.99),
        createBook(6, "Мастер и Маргарита", "Филология", "https://content.img-gorod.ru/nomenclature/29/805/2980525-3.jpg?width=304&height=438&fit=bounds", 455.99),
        createBook(7, "Гарри Поттер и философский камень", "Художественная литература", "https://content.img-gorod.ru/nomenclature/24/059/2405917-2.jpg?width=304&height=438&fit=bounds", 1059.99),
        createBook(8, "Интерстеллар : наука за кадром", "Наука", "https://content.img-gorod.ru/nomenclature/24/805/2480595-1.jpg?width=304&height=438&fit=bounds", 3232.99),
        createBook(9, "Сияние", "Книги для подростков", "https://content.img-gorod.ru/nomenclature/24/217/2421774-2.jpg?width=620&height=1000&fit=bounds", 599.99),
        createBook(10, "Slayer. Титаны американского трэш-метала", "Книги для подростков", "https://content.img-gorod.ru/nomenclature/30/266/3026638-4.jpg?width=304&height=438&fit=bounds", 949.99),
    ];

    const [currentBooks, setCurrentBooks] = useState<IBook[]>([...listOfBooks]);

    const categories = pickedFilters.find((filter: IFilter) => filter.name === EFiltersNames.categories)?.filterItems || [];
    const authors = pickedFilters.find((filter: IFilter) => filter.name === EFiltersNames.authors)?.filterItems || [];

    const addBookToCart = (book: IBook) => {
        const newBook: ICartBook = {
            book,
            count: 1,
        }
        setProductsInCart([...productsInCart, newBook]);
    }

    useEffect(() => {
        const filteredBooks = listOfBooks
            .filter((book: IBook) => categories.length === 0 || categories.includes(book.category))
            .filter((book: IBook) => authors.length === 0 || (!!book.author && authors.includes(book.author)));
        setCurrentBooks(filteredBooks);

        const currCategories = new Set<string>();
        const currAuthors = new Set<string>();
        filteredBooks.forEach((book: IBook) => {
            currCategories.add(book.category);
            if (!!book.author) {
                currAuthors.add(book.author);
            }
        })

        setFilters([
            {
                name: EFiltersNames.authors,
                filterItems: [...currAuthors],
            },
            {
                name: EFiltersNames.categories,
                filterItems: [...currCategories]
            },
        ]);
    }, [pickedFilters])

    return (
        <>
            {currentBooks.map((book: IBook, index: number) => {
                const isBookInCart = productsInCart.some(({ book: product }: ICartBook) => JSON.stringify(product) === JSON.stringify(book));

                return (
                    <div
                        className={styles.productСard}
                        key={index}
                        id={String(book.id)}
                    >
                        <Link to={EPath.main}>
                            <img
                                className={styles.productImage}
                                src={book.imgLink}
                                alt={book.name}
                            />
                        </Link>
                        <div className={styles.productName}>
                            <Link to={EPath.main}>{book.name}</Link>
                        </div>
                        <div className={styles.productPrice}>
                            {`${book.price} ₽`}
                        </div>
                        <button
                            className={clsx(
                                styles.addToCartBtn,
                                isBookInCart && styles["addToCartBtn-pressed"],
                            )}
                            onClick={() => isBookInCart ? navigate(EPath.cart) : addBookToCart(book)}
                        >
                            {isBookInCart ? "Оформить" : "Купить"}
                        </button>
                    </div>
                )
            })}
        </>
    )
}

export default ShopContent;