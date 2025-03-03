import { EPaginationPage } from "./enum";

export interface IPagination {
    currentPage: number,
    setCurrentPage: (page: number) => void,
    itemsPerPage: number,
    setItemsPerPage: (page: number) => void,
    currentItems: any[],
    type?: EPaginationPage,
    resultsClassName?: string,
    paginationClassName?: string,
}