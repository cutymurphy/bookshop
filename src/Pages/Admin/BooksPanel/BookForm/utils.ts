import { IBook } from "../../../Main/ShopPanel/ShopContent/types";
import { IErrors } from "./types";

export const initialBook: IBook = {
    id: "",
    idAdmin: "",
    dateModified: "",
    name: "",
    price: 0,
    category: "",
    genre: "",
    imgLink: "",
}

export const initialErrors: IErrors = {
    name: "",
    category: "",
    genre: "",
    price: "",
    imgLink: "",
    pagesCount: "",
    weight: "",
}

export const trimBookInfo = (bookInfo: IBook): IBook => {
    return {
        ...bookInfo,
        name: bookInfo.name.trim(),
        category: bookInfo.category.trim(),
        genre: bookInfo.genre.trim(),
        imgLink: bookInfo.imgLink.trim(),
    };
};