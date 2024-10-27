import React, { FC, useEffect, useState } from "react";
import { IBook, IShopContent } from "./types";
import styles from './ShopContent.module.scss'
import { Link, useNavigate } from "react-router-dom";
import { EPath } from "../../../../AppPathes.ts";
import clsx from "clsx";
import { EFiltersNames, IFilter } from "../ShopFilters/types.ts";
import { ICartBook } from "../../../Cart/types.ts";
import Loader from "../../../../assets/components/Loader/Loader.tsx";

const ShopContent: FC<IShopContent> = ({
    currentBooks,
    initialBooks,
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const categories = pickedFilters.find((filter: IFilter) => filter.name === EFiltersNames.categories)?.filterItems || [];
    const genres = pickedFilters.find((filter: IFilter) => filter.name === EFiltersNames.genres)?.filterItems || [];
    const coverTypes = pickedFilters.find((filter: IFilter) => filter.name === EFiltersNames.coverTypes)?.filterItems || [];

    const addBookToCart = (book: IBook) => {
        const newBook: ICartBook = {
            book,
            count: 1,
        }
        setProductsInCart([...productsInCart, newBook]);
    }

    useEffect(() => {
        setIsLoading(true);
        const inputValue = searchInput.trim().toLocaleLowerCase();
        const filteredBooks = initialBooks
            .filter((book: IBook) => inputValue === "" || book.name.toLocaleLowerCase().includes(inputValue))
            .filter((book: IBook) => categories.length === 0 || categories.includes(book.category))
            .filter((book: IBook) => genres.length === 0 || genres.includes(book.genre))
            .filter((book: IBook) => coverTypes.length === 0 || (!!book.coverType && coverTypes.includes(book.coverType)));
        setCurrentBooks(filteredBooks);
        setCurrentPage(1);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [pickedFilters, searchInput])

    useEffect(() => {
        const currCategories = new Set<string>();
        const currGenres = new Set<string>();
        const currCoverTypes = new Set<string>();

        currentBooks.forEach((book: IBook) => {
            currCategories.add(book.category);
            currGenres.add(book.genre);
            if (!!book.coverType) {
                currCoverTypes.add(book.coverType);
            }
        });

        setFilters([
            {
                name: EFiltersNames.categories,
                filterItems: [...currCategories],
            },
            {
                name: EFiltersNames.genres,
                filterItems: [...currGenres],
            },
            {
                name: EFiltersNames.coverTypes,
                filterItems: [...currCoverTypes],
            },
        ]);
    }, [currentBooks])

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <>
                {
                    currentBooks
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
                        })
                }
            </>
        )
    )
}

export default ShopContent;