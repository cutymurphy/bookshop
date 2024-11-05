import { IFullProfile } from "../../types";
import { IBook } from "../Main/ShopPanel/ShopContent/types";

export interface ICartBook {
    book: IBook,
    count: number,
}

export interface ICart {
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    currentUser: IFullProfile,
    setCurrentUser: (user: IFullProfile) => void,
}