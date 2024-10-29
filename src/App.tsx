import React, { useEffect, useState } from 'react'
import styles from './App.module.scss'
import Header from './Header/Header.tsx'
import { Auth, Cart, Main } from './Pages/index.ts';
import { Route, Routes } from 'react-router-dom';
import { ICartBook } from './Pages/Cart/types.ts';
import { IBook } from './Pages/Main/ShopPanel/ShopContent/types.ts';
import { fetchBooks, fetchAuthors } from './server/api.js';
import { IAuthor, IFullProfile } from './types.ts';

const App = () => {
    const [currentUser, setCurrentUser] = useState<IFullProfile>();
    const [initialBooks, setInitialBooks] = useState<IBook[]>([]);
    const [currentAuthors, setCurrentAuthors] = useState<IAuthor[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const [productsInCart, setProductsInCart] = useState<ICartBook[]>([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getBooks = async (authors) => {
        try {
            const booksData = await fetchBooks();
            const currBooks = await Promise.all(booksData.map(async ({ id, name, price, category, genre, pagesCount, weight, imgLink, coverType, id_author }) => {
                const author = !id_author ? null : authors.find(({ id }: IAuthor) => id === id_author)?.name;
                const authorName = !!author ? String(author) : null;

                const newBook: IBook = {
                    id,
                    name,
                    category,
                    imgLink,
                    price,
                    author: authorName,
                    genre,
                    pagesCount,
                    weight,
                    coverType,
                }
                return newBook;
            }));

            setInitialBooks(currBooks);
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
        }
    }

    const getAuthors = async () => {
        try {
            const authorsData = await fetchAuthors();
            setCurrentAuthors(authorsData);
            return authorsData;
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
        }
    }

    const fetchData = async () => {
        const authors = await getAuthors();
        if (authors.length > 0) {
            await getBooks(authors);
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={styles.wrapper}>
            <Header
                productsInCart={productsInCart}
                setIsMobileFiltersOpen={setIsMobileFiltersOpen}
                setSearchInput={setSearchInput}
            />
            <Routes>
                <Route path="/" element={
                    <Main
                        initialBooks={initialBooks}
                        productsInCart={productsInCart}
                        setProductsInCart={setProductsInCart}
                        isMobileFiltersOpen={isMobileFiltersOpen}
                        setIsMobileFiltersOpen={setIsMobileFiltersOpen}
                        searchInput={searchInput}
                        isLoading={isLoading}
                    />
                } />
                <Route path="/cart" element={
                    <Cart
                        productsInCart={productsInCart}
                        setProductsInCart={setProductsInCart}
                    />
                } />
                <Route path="/auth" element={
                    <Auth

                    />
                } />
            </Routes>
        </div>
    )
}

export default App;