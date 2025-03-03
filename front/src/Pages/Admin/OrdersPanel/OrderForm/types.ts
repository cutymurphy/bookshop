import { IFullProfile, IOrder } from "../../../../types";

export interface IOrderForm {
    orders: IOrder[],
    setOrders: (orders: IOrder[]) => void,
    currentAdmin: IFullProfile,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
}