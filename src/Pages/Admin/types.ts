import { IOrder } from "../../types";

export interface IAdmin {
    isLoading: boolean,
    orders: IOrder[],
    setOrders: (order: IOrder[]) => void,
    setIsLoading: (loading: boolean) => void,
}