import { EStatusType } from "./Pages/Cart/CartModal/enums"
import { IBook } from "./Pages/Main/ShopPanel/ShopContent/types"

export interface IAuthor {
    id: string,
    name: string,
    surname: string,
    email?: string,
    phone?: string,
    idAdmin: string,
    dateModified: string,
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
    number: number,
    idCartState: string,
    idUser: string,
    idAdmin?: string,
    date: string,
    address: string,
    totalCost: number,
    payment: string,
    status: EStatusType,
    user: IShortProfile,
    admin?: IShortProfile,
    dateModified?: string,
    books: ICartStateBook[],
    message?: string,
}

export interface ICartStateBook {
    book: IBook,
    count: number,
}

export interface IRemoteOrder {
    id: string,
    date: string,
}