import { IFullProfile } from "../../types.ts";
import { ICartBook } from "../Cart/types.ts";
import { IBook } from "./ShopPanel/ShopContent/types.ts";
import { EFiltersNames, IFilter } from "./ShopPanel/ShopFilters/types.ts";

export interface IMain {
    currentUser: IFullProfile,
    setCurrentUser: (user: IFullProfile) => void,
    initialBooks: IBook[],
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    isMobileFiltersOpen: boolean,
    setIsMobileFiltersOpen: (isOpen: boolean) => void,
    searchInput: string,
    isLoading: boolean,
}

export const initialPickedFilters: IFilter[] = [
    {
        name: EFiltersNames.categories,
        filterItems: [],
    },
    {
        name: EFiltersNames.genres,
        filterItems: [],
    },
    {
        name: EFiltersNames.coverTypes,
        filterItems: [],
    },
];