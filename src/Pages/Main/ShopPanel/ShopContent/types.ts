import { ICartBook } from "../../../Cart/types";
import { IFilter } from "../ShopFilters/types";

export interface IBook {
    id: number,
    name: string,
    category: string,
    imgLink: string,
    price: number,
    author?: string,
    // origin: string,
    // coverType: string,
    // newPrice: string,
    // availability: string,
}

export interface IShopContent {
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    pickedFilters: IFilter[],
    setFilters: (filters: IFilter[]) => void,
}