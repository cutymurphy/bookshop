import { IAuthor } from "../../../../types";
import { IErrors } from "./types";

export const initialAuthor: IAuthor = {
    id: "",
    name: "",
    surname: "",
    email: undefined,
    phone: undefined,
    idAdmin: "",
    dateModified: "",
}

export const initialErrors: IErrors = {
    name: "",
    surname: "",
    email: "",
    phone: "",
}

export const trimAuthorInfo = (authorInfo: IAuthor): IAuthor => {
    const { name, surname, email, phone } = authorInfo;
    return {
        ...authorInfo,
        name: name.trim(),
        surname: surname.trim(),
        email: !!email ? (email.trim() === "" ? undefined : email.trim()) : undefined,
        phone: !!phone ? (phone.trim() === "" ? undefined : phone.trim()) : undefined,
    };
};