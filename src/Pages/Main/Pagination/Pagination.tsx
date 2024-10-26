import { FC, useEffect } from "react";
import { IPagination } from "./types";
import React from "react";
import styles from './Pagination.module.scss';

const Pagination: FC<IPagination> = ({
    currentPage,
    setCurrentPage,
    booksPerPage,
    setBooksPerPage,
    currentBooks,
}) => {
    const handleNextPage = () => {
        if (currentPage * booksPerPage < currentBooks.length) {
            setCurrentPage(currentPage + 1)
        };
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        };
    };

    const updateBooksPerPage = () => {
        const width = window.innerWidth;
        if (width >= 1440) setBooksPerPage(12);
        else if (width >= 1024) setBooksPerPage(6);
        else if (width >= 768) setBooksPerPage(12);
        else if (width >= 425) setBooksPerPage(9);
        else setBooksPerPage(6);
    }

    useEffect(() => {
        updateBooksPerPage();
        window.addEventListener("resize", updateBooksPerPage);
        return () => window.removeEventListener("resize", updateBooksPerPage);
    }, []);

    return (
        <div className={styles.pagination}>
            <button
                className={styles.paginationButton}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
            >
                &lt; Назад
            </button>
            <span className={styles.pageNumber}>{currentPage}</span>
            <button
                className={styles.paginationButton}
                onClick={handleNextPage}
                disabled={currentPage * booksPerPage >= currentBooks.length}
            >
                Вперед &gt;
            </button>
        </div>
    )
}

export default Pagination;