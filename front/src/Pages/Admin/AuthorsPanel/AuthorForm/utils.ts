import { IAuthor } from "../../../../types";
import { IErrors } from "./types";

export const initialAuthor: IAuthor = {
    id: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
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
        email: !!email ? email.trim() : "",
        phone: !!phone ? phone.trim() : "",
    };
};