import { IFullProfile } from "../../../types";
import { IBook } from "../../Main/ShopPanel/ShopContent/types";

export interface IBooksPanel {
    books: IBook[],
    setBooks: (orders: IBook[]) => void,
    users: IFullProfile[],
    setIsLoading: (isLoading: boolean) => void,
}