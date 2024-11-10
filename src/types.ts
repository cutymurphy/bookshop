import { ICartBook } from "./Pages/Cart/types"

export interface IAuthor {
    id: string,
    name: string,
    email: string | null,
    phone: string | null,
}

export interface IProfile {
    name: string,
    surname: string,
    password: string,
    email: string,
    phone: string,
}

export interface IFullProfile {
    idUser: string,
    isAdmin: boolean,
    idCart: string,
    name: string,
    surname: string,
    password: string,
    email: string,
    phone: string,
}

export interface IShortProfile {
    name: string,
    surname: string,
    phone?: string,
}

export const initialUser: IFullProfile = {
    idUser: "",
    isAdmin: false,
    idCart: "",
    name: "",
    surname: "",
    password: "",
    email: "",
    phone: "",
}

export interface IOrder {
    id: string,
    date: string,
    address: string,
    totalCost: number,
    payment: string,
    status: string,
    user: IShortProfile,
    admin: IShortProfile,
    books: ICartBook[],
}