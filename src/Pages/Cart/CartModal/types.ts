import { IFullProfile, IOrder } from "../../../types";
import { IBook } from "../../Main/ShopPanel/ShopContent/types";
import { ICartBook } from "../types";

export interface ICartModal {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    setIsLoading: (loading: boolean) => void,
    className?: string,
    checkedBookItems: string[],
    setCheckedBookItems: (books: string[]) => void,
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    user: IFullProfile,
    orders: IOrder[],
    setOrders: (order: IOrder[]) => void,
    ordersCount: number,
    setOrdersCount: (count: number) => void,
    allBooks: IBook[],
    setBooks: (books: IBook[]) => void,
}