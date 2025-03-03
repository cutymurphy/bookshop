import { IFullProfile } from "../../types";
import { ICartBook } from "../Cart/types";

export interface IAuth {
    currentUser: IFullProfile,
    setCurrentUser: (user: IFullProfile) => void,
    currentCart: ICartBook[],
    setCurrentCart: (cart: ICartBook[]) => void,
    userOrdersCount: number,
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