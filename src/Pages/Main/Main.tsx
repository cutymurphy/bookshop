import React, { FC, useEffect, useState } from "react";
import styles from './Main.module.scss'
import DiscountPanel from "./DiscountPanel/DiscountPanel.tsx";
import ShopFilters from "./ShopPanel/ShopFilters/ShopFilters.tsx";
import ShopContent from "./ShopPanel/ShopContent/ShopContent.tsx";
import { IMain, initialFilters, initialPickedFilters } from "./types.ts";
import { IFilter } from "./ShopPanel/ShopFilters/types.ts";
import clsx from "clsx";
import Pagination from "./Pagination/Pagination.tsx";
import { IBook } from "./ShopPanel/ShopContent/types.ts";
import { fetchBooks } from "../../server/api.js";

const Main: FC<IMain> = ({
    productsInCart,
    setProductsInCart,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    searchInput,
}) => {
    const [filters, setFilters] = useState<IFilter[]>([...initialFilters]);
    const [pickedFilters, setPickedFilters] = useState<IFilter[]>([...initialPickedFilters]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(12);
    const [currentBooks, setCurrentBooks] = useState<IBook[]>([]);

    const getBooks = async () => {
        try {
            const booksData = await fetchBooks();
            setCurrentBooks(booksData.map(book => {
                const newBook: IBook = {
                    id: book.id,
                    name: book.name,
                    category: book.category,
                    imgLink: book.img_link,
                    price: book.price,
                }
                return newBook;
            }));
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
        }
    };

    useEffect(() => {
        getBooks();
    }, []);

    return (
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
}

export default Main;