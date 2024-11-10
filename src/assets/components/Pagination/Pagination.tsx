import { FC, useEffect, useState } from "react";
import { IPagination } from "./types";
import React from "react";
import styles from './Pagination.module.scss';
import clsx from "clsx";
import { EPaginationPage } from "./enum.ts";

const Pagination: FC<IPagination> = ({
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    currentItems,
    type = EPaginationPage.main,
    resultsClassName,
    paginationClassName,
}) => {
    const [pageRangeDisplayed, setPageRangeDisplayed] = useState(5);

    const totalPages = Math.ceil(currentItems.length / itemsPerPage);

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

    const updateitemsPerPage = () => {
        const width = window.innerWidth;
        if (width >= 1440) setItemsPerPage(type === "main" ? 12 : 10);
        else if (width >= 1024) setItemsPerPage(6);
        else if (width >= 768) setItemsPerPage(12);
        else if (width >= 425) setItemsPerPage(9);
        else setItemsPerPage(6);

        if (width >= 1440) setPageRangeDisplayed(7);
        else if (width >= 1024) setPageRangeDisplayed(5);
        else setPageRangeDisplayed(3);
    };

    useEffect(() => {
        updateitemsPerPage();
        window.addEventListener("resize", updateitemsPerPage);
        return () => window.removeEventListener("resize", updateitemsPerPage);
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
            <div className={clsx(styles.results, resultsClassName)}>Всего результатов: {currentItems.length}</div>
            {currentItems.length > itemsPerPage &&
                <div className={clsx(styles.pagination, paginationClassName)}>
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