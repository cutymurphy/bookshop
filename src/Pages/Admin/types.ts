import { IAuthor, IFullProfile, IOrder, IRemoteOrder } from "../../types";
import { IBook } from "../Main/ShopPanel/ShopContent/types";

export interface IAdmin {
    isLoading: boolean,
    orders: IOrder[],
    setOrders: (order: IOrder[]) => void,
    allOrders: IRemoteOrder[],
    setIsLoading: (loading: boolean) => void,
    books: IBook[],
    setBooks: (orders: IBook[]) => void,
    authors: IAuthor[],
    users: IFullProfile[],
    setUsers: (users: IFullProfile[]) => void,
}