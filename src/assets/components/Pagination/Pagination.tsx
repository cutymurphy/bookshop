import { FC, useEffect, useState } from "react";
import { IPagination } from "./types";
import React from "react";
import styles from './Pagination.module.scss';
import clsx from "clsx";

const Pagination: FC<IPagination> = ({
    currentPage,
    setCurrentPage,
    booksPerPage,
    setBooksPerPage,
    currentBooks,
}) => {
    const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);

    const totalPages = Math.ceil(currentBooks.length / booksPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const updateBooksPerPage = () => {
        const width = window.innerWidth;
        if (width >= 1440) setBooksPerPage(12);
        else if (width >= 1024) setBooksPerPage(6);
        else if (width >= 768) setBooksPerPage(12);
        else if (width >= 425) setBooksPerPage(9);
        else setBooksPerPage(6);

        if (width >= 1440) setPageRangeDisplayed(7);
        else if (width >= 1024) setPageRangeDisplayed(5);
        else setPageRangeDisplayed(3);
    };

    useEffect(() => {
        updateBooksPerPage();
        window.addEventListener("resize", updateBooksPerPage);
        return () => window.removeEventListener("resize", updateBooksPerPage);
    }, []);

    const renderPages = () => {
        const pages: (string | number)[] = [];
        const startPage = Math.max(2, currentPage - Math.floor(pageRangeDisplayed / 2));
        const endPage = Math.min(totalPages - 1, currentPage + Math.floor(pageRangeDisplayed / 2));

        pages.push(1);

        if (startPage > 2) {
            pages.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className={styles.paginationWrapper}>
            <div className={styles.results}>Всего результатов: {currentBooks.length}</div>
            {currentBooks.length > booksPerPage &&
                <div className={styles.pagination}>
                    <button
                        className={clsx(
                            styles.paginationButton,
                            currentPage === 1 && styles["paginationButton-disabled"]
                        )}
                        onClick={handlePrevPage}
                    >
                        «
                    </button>
                    {renderPages().map((page: string | number, index: number) => (
                        <span
                            key={index}
                            className={clsx(
                                styles.pageNumber,
                                page === currentPage && styles.activePage,
                                typeof page === 'string' && styles.dots,
                            )}
                            onClick={() => typeof page === 'number' && setCurrentPage(page)}
                        >
                            {page}
                        </span>
                    ))}
                    <button
                        className={clsx(
                            styles.paginationButton,
                            currentPage === totalPages && styles["paginationButton-disabled"]
                        )}
                        onClick={handleNextPage}
                    >
                        »
                    </button>
                </div>
            }
        </div>
    )
}

export default Pagination;