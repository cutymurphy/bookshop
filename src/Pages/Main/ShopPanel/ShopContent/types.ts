import { ICartBook } from "../../../Cart/types";
import { IFilter } from "../ShopFilters/types";

export interface IBook {
    id: string,
    author: string | null,
    name: string,
    price: number,
    category: string,
    genre: string,
    pagesCount: number | null,
    weight: number | null,
    imgLink: string,
    coverType: "Мягкая" | "Твердая" | null,
    // newPrice: string,
    // availability: string,
}

export interface IShopContent {
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    pickedFilters: IFilter[],
    setFilters: (filters: IFilter[]) => void,
    searchInput: string,
    currentPage: number,
    setCurrentPage: (page: number) => void,
    booksPerPage: number,
    initialBooks: IBook[],
    currentBooks: IBook[],
    setCurrentBooks: (books: IBook[]) => void,
}