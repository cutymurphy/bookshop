export interface IPagination {
    currentPage: number,
    setCurrentPage: (page: number) => void,
    booksPerPage: number,
    setBooksPerPage: (page: number) => void,
    currentBooks: any[],
}