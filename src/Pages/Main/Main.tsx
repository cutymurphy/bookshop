import React, { FC, useEffect, useState } from "react";
import styles from './Main.module.scss'
import DiscountPanel from "./DiscountPanel/DiscountPanel.tsx";
import ShopFilters from "./ShopPanel/ShopFilters/ShopFilters.tsx";
import ShopContent from "./ShopPanel/ShopContent/ShopContent.tsx";
import { IMain, initialPickedFilters } from "./types.ts";
import { IFilter } from "./ShopPanel/ShopFilters/types.ts";
import clsx from "clsx";
import Pagination from "../../assets/components/Pagination/Pagination.tsx";
import { IBook } from "./ShopPanel/ShopContent/types.ts";
import Loader from "../../assets/components/Loader/Loader.tsx";

const Main: FC<IMain> = ({
    currentUser,
    initialBooks,
    productsInCart,
    setProductsInCart,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    searchInput,
    isLoading,
}) => {
    const [filters, setFilters] = useState<IFilter[]>([]);
    const [pickedFilters, setPickedFilters] = useState<IFilter[]>([...initialPickedFilters]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(12);
    const [currentBooks, setCurrentBooks] = useState<IBook[]>([]);

    useEffect(() => {
        setCurrentBooks(initialBooks.filter((book: IBook) => book.count > 0));
    }, [initialBooks])

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
                            cartId={currentUser.idCart}
                        />
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={booksPerPage}
                    setItemsPerPage={setBooksPerPage}
                    currentItems={currentBooks}
                />
            </div>
        )
    )
}

export default Main;