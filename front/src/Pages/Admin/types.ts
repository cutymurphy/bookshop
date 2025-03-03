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
    setAuthors: (users: IAuthor[]) => void,
    users: IFullProfile[],
    setUsers: (users: IFullProfile[]) => void,
}