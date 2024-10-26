import React, { FC, useState } from "react";
import styles from './Main.module.scss'
import DiscountPanel from "./DiscountPanel/DiscountPanel.tsx";
import ShopFilters from "./ShopPanel/ShopFilters/ShopFilters.tsx";
import ShopContent from "./ShopPanel/ShopContent/ShopContent.tsx";
import { IMain, initialFilters, initialPickedFilters } from "./types.ts";
import { IFilter } from "./ShopPanel/ShopFilters/types.ts";
import clsx from "clsx";
import Pagination from "./Pagination/Pagination.tsx";
import { IBook } from "./ShopPanel/ShopContent/types.ts";

const Main: FC<IMain> = ({
    productsInCart,
    setProductsInCart,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    searchInput,
}) => {
    const [filters, setFilters] = useState<IFilter[]>([...initialFilters]);
    const [pickedFilters, setPickedFilters] = useState<IFilter[]>([...initialPickedFilters]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [booksPerPage, setBooksPerPage] = useState<number>(12);

    const createBook = (id: number, name: string, category: string, imgLink: string, price: number): IBook => {
        return {
            id,
            name,
            category,
            imgLink,
            price,
        }
    }

    const listOfBooks = [
        createBook(1, "Зловещий ресторан", "Художественная литература", "https://content.img-gorod.ru/nomenclature/30/172/3017246-4.jpg?width=304&height=438&fit=bounds", 931.99),
        createBook(2, "Хрупкое равновесие. Книга 1", "Художественная литература", "https://content.img-gorod.ru/nomenclature/27/805/2780568.jpg?width=620&height=1000&fit=bounds", 566.99),
        createBook(3, "Мода и сериалы: от Друзей и Твин Пикс до Эйфории и Убивая Еву", "Красота", "https://content.img-gorod.ru/nomenclature/29/472/2947284-3.jpg?width=620&height=1000&fit=bounds", 799.99),
        createBook(4, "Дворец потерянных душ. Наследник Сентерии (#2)", "Манга", "https://books.google.ru/books/publisher/content?id=zJsGEQAAQBAJ&hl=ru&pg=PP1&img=1&zoom=3&bul=1&sig=ACfU3U3DnjZlaaQHS4Vdwj1nX0Vu8cx96A&w=1280", 729.99),
        createBook(5, "Дюна: Дюна. Мессия Дюны. Дети Дюны", "Наука", "https://books.google.ru/books/publisher/content?id=jbA1DwAAQBAJ&hl=ru&pg=PP1&img=1&zoom=3&bul=1&sig=ACfU3U3aWbgnHZBSxNOu6kv5FPSA3-iC_g&w=1280", 1699.99),
        createBook(6, "Мастер и Маргарита", "Филология", "https://content.img-gorod.ru/nomenclature/29/805/2980525-3.jpg?width=304&height=438&fit=bounds", 455.99),
        createBook(7, "Гарри Поттер и философский камень", "Художественная литература", "https://content.img-gorod.ru/nomenclature/24/059/2405917-2.jpg?width=304&height=438&fit=bounds", 1059.99),
        createBook(8, "Интерстеллар : наука за кадром", "Наука", "https://content.img-gorod.ru/nomenclature/24/805/2480595-1.jpg?width=304&height=438&fit=bounds", 3232.99),
        createBook(9, "Сияние", "Книги для подростков", "https://content.img-gorod.ru/nomenclature/24/217/2421774-2.jpg?width=620&height=1000&fit=bounds", 599.99),
        createBook(10, "Slayer. Титаны американского трэш-метала", "Книги для подростков", "https://content.img-gorod.ru/nomenclature/30/266/3026638-4.jpg?width=304&height=438&fit=bounds", 949.99),
    ];

    const [currentBooks, setCurrentBooks] = useState<IBook[]>([...listOfBooks]);

    return (
        <div className={clsx(
            styles.shopWrapper,
            isMobileFiltersOpen && styles.shopWrapperOpenFilters,
        )}>
            <DiscountPanel />
            <div className={styles.shopPanel}>
                <ShopFilters
                    filters={filters}
                    pickedFilters={pickedFilters}
                    setPickedFilters={setPickedFilters}
                    isMobileFiltersOpen={isMobileFiltersOpen}
                    setIsMobileFiltersOpen={setIsMobileFiltersOpen}
                />
                <div className={styles.shopContent}>
                    <ShopContent
                        currentBooks={currentBooks}
                        setCurrentBooks={setCurrentBooks}
                        productsInCart={productsInCart}
                        setProductsInCart={setProductsInCart}
                        pickedFilters={pickedFilters}
                        setFilters={setFilters}
                        searchInput={searchInput}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        booksPerPage={booksPerPage}
                    />
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                booksPerPage={booksPerPage}
                setBooksPerPage={setBooksPerPage}
                currentBooks={currentBooks}
            />
        </div>
    )
}

export default Main;