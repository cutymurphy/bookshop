import { IAuthor } from "../../../types";
import { IBook } from "../../Main/ShopPanel/ShopContent/types";

export interface IAuthorsPanel {
    authors: IAuthor[],
    setAuthors: (authors: IAuthor[]) => void,
    books: IBook[],
    setIsLoading: (loading: boolean) => void,
}

export type TSortColumn = "name" | "surname";