import { IAuthor, IFullProfile } from "../../../../types";
import { IBook } from "../../../Main/ShopPanel/ShopContent/types";

export interface IAuthorForm {
    authors: IAuthor[],
    setAuthors: (authors: IAuthor[]) => void,
    books: IBook[],
    setBooks: (books: IBook[]) => void,
    users: IFullProfile[],
    currentAdmin: IFullProfile,
    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
}

export interface IErrors {
    name: string,
    surname: string,
    email: string,
    phone: string,
}