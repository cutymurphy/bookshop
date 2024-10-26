import { ICartBook } from "../Cart/types.ts";
import { EFiltersNames, IFilter } from "./ShopPanel/ShopFilters/types.ts";

export interface IMain {
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    isMobileFiltersOpen: boolean,
    setIsMobileFiltersOpen: (isOpen: boolean) => void,
    searchInput: string,
}

export const initialFilters: IFilter[] = [
    {
        name: EFiltersNames.categories,
        filterItems: ["Художественная литература", "Комиксы", "Манга", "Филология", "Детские книги", "Книги для подростков", "Медицина и здоровье", "Красота", "Наука", "Религия и философия", "Психология", "Экономика", "Искусство"],
    },
    {
        name: EFiltersNames.authors,
        filterItems: ["Автор_1", "Автор_2"],
    },
];

export const initialPickedFilters: IFilter[] = [
    {
        name: EFiltersNames.categories,
        filterItems: [],
    },
    {
        name: EFiltersNames.authors,
        filterItems: [],
    },
];