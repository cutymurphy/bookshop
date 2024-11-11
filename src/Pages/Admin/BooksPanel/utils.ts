import { IBook } from "../../Main/ShopPanel/ShopContent/types";

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

export const areObjectsEqual = (obj1: object, obj2: object): boolean => {
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key of keys) {
        const value1 = (obj1 as any)[key];
        const value2 = (obj2 as any)[key];

        if (!!value1 === !!value2) {
            continue;
        }

        if (value1 !== value2) {
            return false;
        }
    }

    return true;
}