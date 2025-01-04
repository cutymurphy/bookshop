import { IOrder } from "../../types"

export interface IOrders {
    allOrders: IOrder[],
    orders: IOrder[],
    setOrders: (orders: IOrder[]) => void,
    setIsLoading: (isLoading: boolean) => void,
}