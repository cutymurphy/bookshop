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
    itemsCount: number,
    totalCost: number,
    weight: number,
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
    itemsCount: 0,
    totalCost: 0,
    weight: 0
}