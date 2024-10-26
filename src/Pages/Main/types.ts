import { IBook } from "./ShopPanel/ShopContent/types";

export interface IMain {
    productsInCart: IBook[],
    setProductsInCart: (books: IBook[]) => void,
}