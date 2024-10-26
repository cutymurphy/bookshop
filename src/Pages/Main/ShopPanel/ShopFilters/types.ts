export interface IFilter {
    name: EFiltersNames,
    filterItems: string[],
}

export interface IShopFilters {
    filters: IFilter[],
    pickedFilters: IFilter[],
    setPickedFilters: (filters: IFilter[]) => void,
    isMobileFiltersOpen: boolean,
    setIsMobileFiltersOpen: (isOpen: boolean) => void,
}

export enum EFiltersNames {
    categories = "Выберите категорию:",
    authors = "Выберите автора:",
}