import { IBook } from "../Main/ShopPanel/ShopContent/types";

export interface ICartBook {
    book: IBook,
    count: number,
}

export interface ICart {
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    cartId: string,
}