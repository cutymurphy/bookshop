import React, { FC, useEffect, useState } from "react";
import { IBook, IShopContent } from "./types";
import styles from './ShopContent.module.scss'
import { Link, useNavigate } from "react-router-dom";
import { EPath } from "../../../../AppPathes.ts";
import clsx from "clsx";
import { EFiltersNames, IFilter } from "../ShopFilters/types.ts";
import { ICartBook } from "../../../Cart/types.ts";
import Loader from "../../../../assets/components/Loader/Loader.tsx";
import { addBookToCart } from "../../../../server/api.js";
import { toast } from "sonner";
import Badge from "../../../../assets/components/Badge/Badge.tsx";
import { EBadgeType } from "../../../../assets/components/Badge/enums.ts";

const ShopContent: FC<IShopContent> = ({
    currentBooks,
    initialBooks,
    setCurrentBooks,
    productsInCart,
    setProductsInCart,
    pickedFilters,
    setFilters,
    searchInput,
    currentPage,
    setCurrentPage,
    booksPerPage,
    cartId,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const categories = pickedFilters.find((filter: IFilter) => filter.name === EFiltersNames.categories)?.filterItems || [];
    const genres = pickedFilters.find((filter: IFilter) => filter.name === EFiltersNames.genres)?.filterItems || [];
    const coverTypes = pickedFilters.find((filter: IFilter) => filter.name === EFiltersNames.coverTypes)?.filterItems || [];

    const handleAddBookToCart = async (book: IBook) => {
        const currentDate = (new Date()).toLocaleString();
        const newBook: ICartBook = {
            book,
            count: 1,
            date: currentDate,
        }
        setIsLoading(true);
        setProductsInCart([...productsInCart, newBook]);
        if (!!cartId) {
            await addBookToCart(cartId, book.id, 1, currentDate);
        }
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Книга добавлена в корзину');
        }, !!cartId ? 500 : 200);
    }

    useEffect(() => {
        setIsLoading(true);
        const inputValue = searchInput.trim().toLocaleLowerCase();
        setCurrentBooks(initialBooks
            .filter((book: IBook) => book.count > 0)
            .filter((book: IBook) => inputValue === "" || book.name.toLocaleLowerCase().includes(inputValue))
            .filter((book: IBook) => categories.length === 0 || categories.includes(book.category))
            .filter((book: IBook) => genres.length === 0 || genres.includes(book.genre))
            .filter((book: IBook) => coverTypes.length === 0 || (!!book.coverType && coverTypes.includes(book.coverType))));
        setCurrentPage(1);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [initialBooks, pickedFilters, searchInput])

    useEffect(() => {
        const currCategories = new Set<string>();
        const currGenres = new Set<string>();
        const currCoverTypes = new Set<string>();

        currentBooks.forEach((book: IBook) => {
            currCategories.add(book.category);
            currGenres.add(book.genre);
            if (!!book.coverType) {
                currCoverTypes.add(book.coverType);
            }
        });

        setFilters([
            {
                name: EFiltersNames.categories,
                filterItems: [...currCategories],
            },
            {
                name: EFiltersNames.genres,
                filterItems: [...currGenres],
            },
            {
                name: EFiltersNames.coverTypes,
                filterItems: [...currCoverTypes],
            },
        ]);
    }, [currentBooks])

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <>
                {
                    currentBooks
                        .slice(currentPage * booksPerPage - booksPerPage, currentPage * booksPerPage)
                        .map((book: IBook) => {
                            const isBookInCart = productsInCart.some(({ book: product }: ICartBook) => book.id === product.id);
                            /* TO-DO: добавить детальную страницу товара  */
                            return (
                                <div
                                    className={styles.productСard}
                                    key={book.id}
                                    id={String(book.id)}
                                >
                                    <Link to={EPath.main}>
                                        <img
                                            className={styles.productImage}
                                            src={book.imgLink}
                                            alt={book.name}
                                        />
                                    </Link>
                                    <div className={styles.productName}>
                                        <Link to={EPath.main}>{book.name}</Link>
                                    </div>
                                    <div className={styles.productAuthor}>
                                        {book.author}
                                    </div>
                                    <div className={styles.productPrice}>
                                        {`${book.price} ₽`}
                                    </div>
                                    <button
                                        className={clsx(
                                            styles.addToCartBtn,
                                            isBookInCart && styles["addToCartBtn-pressed"],
                                        )}
                                        onClick={() => isBookInCart ? navigate(EPath.cart) : handleAddBookToCart(book)}
                                    >
                                        {isBookInCart ? "Оформить" : "Купить"}
                                    </button>
                                    {book.count < 3 &&
                                        <Badge
                                            type={EBadgeType.pink}
                                            className={styles.badge}
                                        >
                                            Осталось мало
                                        </Badge>
                                    }
                                </div>
                            )
                        })
                }
            </>
        )
    )
}

export default ShopContent;