import { IFullProfile, IOrder } from "../../../types";

export interface IUsersPanel {
    users: IFullProfile[],
    setUsers: (orders: IFullProfile[]) => void,
    orders: IOrder[],
    setOrders: (orders: IOrder[]) => void,
    setIsLoading: (isLoading: boolean) => void,
}

export type TSortColumn = "admin" | "surname";