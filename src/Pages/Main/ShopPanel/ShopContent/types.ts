export interface IBook {
    id: number,
    name: string,
    category: string,
    imgLink: string,
    price: number,
    // origin: string,
    // coverType: string,
    // newPrice: string,
    // availability: string,
}

export interface IShopContent {
    productsInCart: IBook[],
    setProductsInCart: (books: IBook[]) => void,
}