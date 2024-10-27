import React, { FC, useEffect, useState } from "react";
import styles from './Main.module.scss'
import DiscountPanel from "./DiscountPanel/DiscountPanel.tsx";
import ShopFilters from "./ShopPanel/ShopFilters/ShopFilters.tsx";
import ShopContent from "./ShopPanel/ShopContent/ShopContent.tsx";
import { IMain, initialPickedFilters } from "./types.ts";
import { IFilter } from "./ShopPanel/ShopFilters/types.ts";
import clsx from "clsx";
import Pagination from "./Pagination/Pagination.tsx";
import { IBook } from "./ShopPanel/ShopContent/types.ts";
import { fetchAuthors, fetchBooks } from "../../server/api.js";
import Loader from "../../assets/components/Loader/Loader.tsx";
import { IAuthor } from "../../types.ts";

const Main: FC<IMain> = ({
    productsInCart,
    setProductsInCart,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    searchInput,
}) => {
    const [filters, setFilters] = useState<IFilter[]>([]);
    const [pickedFilters, setPickedFilters] = useState<IFilter[]>([...initialPickedFilters]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(12);
    const [initialBooks, setInitialBooks] = useState<IBook[]>([]);
    const [currentBooks, setCurrentBooks] = useState<IBook[]>([]);
    const [currentAuthors, setCurrentAuthors] = useState<IAuthor[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getBooks = async (authors) => {
        try {
            const booksData = await fetchBooks();
            const currBooks = await Promise.all(booksData.map(async ({ id, name, price, category, genre, pagesCount, weight, imgLink, coverType, id_author }) => {
                const author = !id_author ? null : authors.find(({ id }: IAuthor) => id === id_author)?.name;
                const authorName = !!author ? String(author) : null;

                const newBook: IBook = {
                    id,
                    name,
                    category,
                    imgLink,
                    price,
                    author: authorName,
                    genre,
                    pagesCount,
                    weight,
                    coverType,
                }
                return newBook;
            }));

            setInitialBooks(currBooks);
            setCurrentBooks(currBooks);
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
        }
    }

    const getAuthors = async () => {
        try {
            const authorsData = await fetchAuthors();
            setCurrentAuthors(authorsData);
            return authorsData;
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
        }
    }

    const fetchData = async () => {
        const authors = await getAuthors();
        if (authors.length > 0) {
            await getBooks(authors);
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={clsx(
                styles.shopWrapper,
                isMobileFiltersOpen && styles.shopWrapperOpenFilters,
            )}>
                <DiscountPanel />
                <div className={styles.shopPanel}>
                    <ShopFilters
                        filters={filters}
                        pickedFilters={pickedFilters}
                        setPickedFilters={setPickedFilters}
                        isMobileFiltersOpen={isMobileFiltersOpen}
                        setIsMobileFiltersOpen={setIsMobileFiltersOpen}
                    />
                    <div className={styles.shopContent}>
                        <ShopContent
                            initialBooks={initialBooks}
                            currentBooks={currentBooks}
                            setCurrentBooks={setCurrentBooks}
                            productsInCart={productsInCart}
                            setProductsInCart={setProductsInCart}
                            pickedFilters={pickedFilters}
                            setFilters={setFilters}
                            searchInput={searchInput}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            booksPerPage={booksPerPage}
                        />
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    booksPerPage={booksPerPage}
                    setBooksPerPage={setBooksPerPage}
                    currentBooks={currentBooks}
                />
            </div>
        )
    )
}

export default Main;