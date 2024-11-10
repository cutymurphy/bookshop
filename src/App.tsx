import React, { useEffect, useState } from 'react'
import styles from './App.module.scss'
import Header from './Header/Header.tsx'
import { Auth, Cart, Main } from './Pages/index.ts';
import { Route, Routes } from 'react-router-dom';
import { ICartBook } from './Pages/Cart/types.ts';
import { IBook } from './Pages/Main/ShopPanel/ShopContent/types.ts';
import { fetchBooks, fetchAuthors, getUserById, getCartBooksById, fetchUsers, fetchOrders, getCartStateBooksById } from './server/api.js';
import { IAuthor, IFullProfile, initialUser, IOrder } from './types.ts';
import Admin from './Pages/Admin/Admin.tsx';

const App = () => {
    const [currentUser, setCurrentUser] = useState<IFullProfile>({ ...initialUser });
    const [initialBooks, setInitialBooks] = useState<IBook[]>([]);
    const [currentAuthors, setCurrentAuthors] = useState<IAuthor[]>([]);
    const [currentUsers, setCurrentUsers] = useState<IFullProfile[]>([]);
    const [currentOrders, setCurrentOrders] = useState<IOrder[]>([]);
    const [searchInput, setSearchInput] = useState<string>('');
    const [productsInCart, setProductsInCart] = useState<ICartBook[]>([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadBooksAndAuthors = async () => {
        try {
            const authorsData = await fetchAuthors();
            setCurrentAuthors(authorsData);

            const booksData = await fetchBooks();
            const currBooks = booksData.map(({ id, name, price, category, genre, pagesCount, weight, imgLink, coverType, id_author }) => {
                const author = authorsData.find(({ id }: IAuthor) => id === id_author)?.name || null;
                const newBook: IBook = {
                    id,
                    name,
                    category,
                    imgLink,
                    price,
                    author,
                    genre,
                    pagesCount,
                    weight,
                    coverType,
                }
                return newBook;
            });
            setInitialBooks(currBooks);
        } catch (error) {
            console.error('Ошибка загрузки книг или авторов:', error);
        }
    };

    const loadUsers = async () => {
        try {
            const usersData = await fetchUsers();
            setCurrentUsers(usersData);
            return usersData;
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            return [];
        }
    };

    const loadOrders = async (users) => {
        try {
            const ordersData = await fetchOrders();

            const orders = await Promise.all(ordersData.map(async (order) => {

                const booksData = await getCartStateBooksById(order.idCartState);
                const orderBooks = booksData.map((book) => {
                    const bookInfo = initialBooks.find((currBook) => book.idBook === currBook.id);
                    return {
                        book: bookInfo,
                        count: book.bookCount,
                    }
                });

                const user = users.find((currUser) => currUser.idUser === order.idUser);
                const admin = users.find((currUser) => currUser.idUser === order.idAdmin);

                const adminImportant = admin
                    ? (({ idUser, isAdmin, idCart, password, email, phone, ...rest }) => rest)(admin)
                    : undefined;

                const userImportant = (({ idUser, isAdmin, idCart, password, email, ...rest }) => rest)(user);
                const orderImportant = (({ idCartState, idUser, idAdmin, ...rest }) => rest)(order);

                const orderInfo: IOrder = {
                    ...orderImportant,
                    user: userImportant,
                    admin: adminImportant,
                    books: orderBooks,
                }
                return (orderInfo);
            }));
            setCurrentOrders(orders);
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
        }
    };

    const loadUserAndCart = async () => {
        const savedUserId = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');

        if (!!savedUserId) {
            const user = await getUserById(savedUserId);
            const userCart = await getCartBooksById(user.idCart);
            setCurrentUser({ ...user, isAdmin: !!user.isAdmin });
            if (userCart.length > 0) {
                setProductsInCart(userCart.map(({ idBook, count }) => ({
                    count: Number(count),
                    book: initialBooks.find((b: IBook) => b.id === idBook) || null,
                })));
            };
        } else {
            setCurrentUser({ ...initialUser });
        }
    };

    const loadAdminData = async () => {
        setIsLoading(true);
        const usersData = await loadUsers();
        await loadOrders(usersData);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    useEffect(() => {
        if (initialBooks.length > 0) {
            loadUserAndCart();
        }
        if (currentUser.isAdmin) {
            loadAdminData();
        }
    }, [initialBooks, currentUser.idUser]);

    useEffect(() => {
        const loadData = async () => {
            await loadBooksAndAuthors();
            setIsLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className={styles.wrapper}>
            <Header
                productsInCart={productsInCart}
                setIsMobileFiltersOpen={setIsMobileFiltersOpen}
                setSearchInput={setSearchInput}
                isAdmin={currentUser.isAdmin}
            />
            <Routes>
                <Route path="/" element={
                    <Main
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
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
                        cartId={currentUser.idCart}
                    />
                } />
                <Route path="/auth" element={
                    <Auth
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        currentCart={productsInCart}
                        setCurrentCart={setProductsInCart}
                    />
                } />
                {currentUser.isAdmin &&
                    <Route
                        path="/admin"
                        element={
                            <Admin
                                isLoading={isLoading}
                            />
                        }
                    />
                }
            </Routes>
        </div>
    )
}

export default App;