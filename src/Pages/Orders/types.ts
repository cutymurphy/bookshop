import { IOrder } from "../../types"

export interface IOrders {
    orders: IOrder[],
    setOrders: (orders: IOrder[]) => void,
    setIsLoading: (isLoading: boolean) => void,
}