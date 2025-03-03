import { ICartBook } from "../types";

export interface ICartCard {
    cartBook: ICartBook,
    checkedBookItems: string[],
    setCheckedItem: (bookId: string) => void,
    manipulateBookInCart: (bookInCart: ICartBook, operation: "plus" | "minus") => void,
    handleDeleteBookFromCart: (bookToDelete: ICartBook) => void,
    isAvailable?: boolean,
}