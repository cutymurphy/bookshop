import { ICartBook } from "../Pages/Cart/types";

export interface IHeader {
    productsInCart: ICartBook[],
    setIsMobileFiltersOpen: (isOpen: boolean) => void,
    setSearchInput: (input: string) => void,
}