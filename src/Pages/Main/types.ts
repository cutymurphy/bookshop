import { ICartBook } from "../Cart/types.ts";
import { EFiltersNames, IFilter } from "./ShopPanel/ShopFilters/types.ts";

export interface IMain {
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    isMobileFiltersOpen: boolean,
    setIsMobileFiltersOpen: (isOpen: boolean) => void,
    searchInput: string,
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