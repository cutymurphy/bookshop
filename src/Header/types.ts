import { ICartBook } from "../Pages/Cart/types";

export interface IHeader {
    userOrdersCount: number,
    productsInCart: ICartBook[],
    setIsMobileFiltersOpen: (isOpen: boolean) => void,
    setSearchInput: (input: string) => void,
    isAdmin: boolean, 
}