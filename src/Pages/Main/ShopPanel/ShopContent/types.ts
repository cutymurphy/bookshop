import { ICartBook } from "../../../Cart/types";
import { IFilter } from "../ShopFilters/types";

export interface IBook {
    id: string,
    idAuthor?: string,
    author?: string,
    idAdmin: string,
    dateModified: string,
    name: string,
    price: number,
    category: string,
    genre: string,
    pagesCount?: number,
    weight?: number,
    imgLink: string,
    coverType?: "Мягкая" | "Твердая",
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
    cartId: string,
}