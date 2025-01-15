import { IBook } from "../Main/ShopPanel/ShopContent/types";

export const initialBook: IBook = {
    id: "",
    idAdmin: "",
    count: 0,
    dateModified: "",
    name: "",
    price: 0,
    category: "",
    genre: "",
    imgLink: ""
}

export const pluralizeWord = (count: number): string => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod100 >= 11 && mod100 <= 14) {
        return "штук";
    }
    if (mod10 === 1) {
        return "штука";
    }
    if (mod10 >= 2 && mod10 <= 4) {
        return "штуки";
    }
    return "штук";
}