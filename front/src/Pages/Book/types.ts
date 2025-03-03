import { ICartBook } from "../Cart/types";
import { IBook } from "../Main/ShopPanel/ShopContent/types";

export interface IBookPage {
    cartId: string,
    productsInCart: ICartBook[],
    setProductsInCart: (books: ICartBook[]) => void,
    books: IBook[],
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
}