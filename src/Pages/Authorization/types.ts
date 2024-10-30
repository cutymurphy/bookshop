import { IFullProfile, IProfile } from "../../types";

export interface IAuth {
    currentUser: IFullProfile,
    setCurrentUser: (user: IFullProfile) => void,
}

export const initialErrors: IProfile = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
};