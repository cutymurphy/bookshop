import { IOrder } from "../../../types";

export interface IOrdersPanel {
    orders: IOrder[],
    setOrders: (order: IOrder[]) => void,
    setIsLoading: (loading: boolean) => void,
}