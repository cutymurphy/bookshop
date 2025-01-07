import { IOrder } from "../../types"
import { IBook } from "../Main/ShopPanel/ShopContent/types";

export interface IOrders {
    allOrders: IOrder[],
    orders: IOrder[],
    setOrders: (orders: IOrder[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    initialBooks: IBook[],
    setInitialBooks: (books: IBook[]) => void,
}