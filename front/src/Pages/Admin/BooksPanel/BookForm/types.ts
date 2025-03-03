import { IAuthor, IFullProfile } from "../../../../types";
import { ICartBook } from "../../../Cart/types";
import { IBook } from "../../../Main/ShopPanel/ShopContent/types";

export interface IBookForm {
    books: IBook[],
    setBooks: (orders: IBook[]) => void,
    authors: IAuthor[],
    users: IFullProfile[],
    currentAdmin: IFullProfile,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
}

export interface IErrors {
    name: string,
    price: string,
    category: string,
    genre: string,
    pagesCount: string,
    imgLink: string,
    weight: string,
    count: string,
}