import { IFullProfile, IOrder, IRemoteOrder } from "../../types";
import { IBook } from "../Main/ShopPanel/ShopContent/types";

export interface ICartBook {
    book: IBook,
    count: number,
}

export interface ICart {
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    user: IFullProfile,
    orders: IOrder[],
    setOrders: (orders: IOrder[]) => void,
    allOrders: IRemoteOrder[],
    setAllOrders: (orders: IRemoteOrder[]) => void,
    allBooks: IBook[],
    setBooks: (books: IBook[]) => void,
}