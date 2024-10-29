import { IFullProfile, IProfile } from "../../types";

export interface IAuth {
    currentUser: IFullProfile | undefined,
    setCurrentUser: (user: IFullProfile | undefined) => void,
}

export const initialState: IProfile = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
};