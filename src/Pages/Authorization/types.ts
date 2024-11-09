import { IFullProfile, IProfile } from "../../types";
import { ICartBook } from "../Cart/types";

export interface IAuth {
    currentUser: IFullProfile,
    setCurrentUser: (user: IFullProfile) => void,
    setCurrentCart: (cart: ICartBook[]) => void,
}

export interface IErrors {
    name: string,
    surname: string,
    password: string,
    email: string,
    phone: string,
    acceptRules: string,
}

export const initialErrors: IErrors = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    acceptRules: "",
};