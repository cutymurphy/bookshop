import { IOrder } from "../../types"
import { IBook } from "../Main/ShopPanel/ShopContent/types";

export interface IOrders {
    allOrders: IOrder[],
    setAllOrders: (orders: IOrder[]) => void,
    orders: IOrder[],
    initialBooks: IBook[],
    setInitialBooks: (books: IBook[]) => void,
}