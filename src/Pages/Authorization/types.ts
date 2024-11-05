import { IFullProfile, IProfile } from "../../types";
import { ICartBook } from "../Cart/types";

export interface IAuth {
    currentUser: IFullProfile,
    setCurrentUser: (user: IFullProfile) => void,
    setCurrentCart: (cart: ICartBook[]) => void,
}

export const initialErrors: IProfile = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
};