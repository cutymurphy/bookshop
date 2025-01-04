import { IFullProfile, IOrder } from "../../types";
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
    setOrders: (order: IOrder[]) => void,
    ordersCount: number,
    setOrdersCount: (count: number) => void,
}