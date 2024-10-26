import React, { FC, useEffect, useState } from "react";
import { IBook, IShopContent } from "./types";
import styles from './ShopContent.module.scss'
import { Link, useNavigate } from "react-router-dom";
import { EPath } from "../../../../AppPathes.ts";
import clsx from "clsx";
import { EFiltersNames, IFilter } from "../ShopFilters/types.ts";
import { ICartBook } from "../../../Cart/types.ts";

const ShopContent: FC<IShopContent> = ({
    currentBooks,
    setCurrentBooks,
    productsInCart,
    setProductsInCart,
    pickedFilters,
    setFilters,
    searchInput,
    currentPage,
    setCurrentPage,
    booksPerPage,
}) => {
    const navigate = useNavigate();

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
        const inputValue = searchInput.trim().toLocaleLowerCase();
        const filteredBooks = currentBooks
            .filter((book: IBook) => inputValue === "" || book.name.toLocaleLowerCase().includes(inputValue))
            .filter((book: IBook) => categories.length === 0 || categories.includes(book.category))
            .filter((book: IBook) => authors.length === 0 || (!!book.author && authors.includes(book.author)));
        setCurrentBooks(filteredBooks);
        setCurrentPage(1);
    }, [pickedFilters, searchInput])

    useEffect(() => {
        const currCategories = new Set<string>();
        const currAuthors = new Set<string>();
        currentBooks.forEach((book: IBook) => {
            currCategories.add(book.category);
            if (!!book.author) {
                currAuthors.add(book.author);
            }
        });

        setFilters([
            {
                name: EFiltersNames.authors,
                filterItems: [...currAuthors],
            },
            {
                name: EFiltersNames.categories,
                filterItems: [...currCategories],
            },
        ]);
    }, [currentBooks])

    return (
        <>
            {currentBooks
                .slice(currentPage * booksPerPage - booksPerPage, currentPage * booksPerPage)
                .map((book: IBook, index: number) => {
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