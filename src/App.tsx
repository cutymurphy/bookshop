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
import { EPath } from './AppPathes.ts';
import OrderForm from './Pages/Admin/OrdersPanel/OrderForm/OrderForm.tsx';
import BooksForm from './Pages/Admin/BooksPanel/BookForm/BookForm.tsx';
import Orders from './Pages/Orders/Orders.tsx';

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
            const currBooks = booksData.map((book) => {
                const author = authorsData.find(({ id }: IAuthor) => id === book.idAuthor)?.name || null;
                const newBook: IBook = {
                    ...book,
                    author,
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
                const orderImportant = (({ idAdmin, ...rest }) => rest)(order);

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
        try {
            setIsLoading(true);
            const usersData = await loadUsers();
            await loadOrders(usersData);
        } catch (error) {
            console.error('Ошибка при загрузке данных администратора:', error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            if (initialBooks.length > 0) {
                await loadUserAndCart();
            }
            if (currentUser.isAdmin) {
                await loadAdminData();
            }
        };
        initializeData();
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
                <Route
                    path={EPath.main}
                    element={
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
                    }
                />
                <Route
                    path={EPath.cart}
                    element={
                        <Cart
                            productsInCart={productsInCart}
                            setProductsInCart={setProductsInCart}
                            user={currentUser}
                            orders={currentOrders}
                            setOrders={setCurrentOrders}
                        />
                    }
                />
                <Route
                    path={EPath.orders}
                    element={
                        <Orders
                            orders={currentOrders.filter((order: IOrder) => order.idUser === currentUser.idUser)}
                            setOrders={setCurrentOrders}
                            setIsLoading={setIsLoading}
                        />
                    }
                />
                <Route
                    path={EPath.auth}
                    element={
                        <Auth
                            currentUser={currentUser}
                            setCurrentUser={setCurrentUser}
                            currentCart={productsInCart}
                            setCurrentCart={setProductsInCart}
                        />
                    }
                />
                {currentUser.isAdmin &&
                    <Route
                        path={EPath.admin}
                        element={
                            <Admin
                                isLoading={isLoading}
                                orders={currentOrders}
                                setOrders={setCurrentOrders}
                                setIsLoading={setIsLoading}
                                books={initialBooks}
                                setBooks={setInitialBooks}
                                authors={currentAuthors}
                                users={currentUsers}
                                setUsers={setCurrentUsers}
                                currentAdmin={currentUser}
                            />
                        }
                    />
                }
                {currentUser.isAdmin &&
                    <Route
                        path={`${EPath.adminOrder}/:id`}
                        element={
                            <OrderForm
                                currentAdmin={currentUser}
                                orders={currentOrders}
                                setOrders={setCurrentOrders}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                            />
                        }
                    />
                }
                {currentUser.isAdmin &&
                    <Route
                        path={`${EPath.adminBook}/:id`}
                        element={
                            <BooksForm
                                currentAdmin={currentUser}
                                books={initialBooks}
                                authors={currentAuthors}
                                users={currentUsers}
                                setBooks={setInitialBooks}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                            />
                        }
                    />
                }
                {currentUser.isAdmin &&
                    <Route
                        path={EPath.adminBook}
                        element={
                            <BooksForm
                                currentAdmin={currentUser}
                                books={initialBooks}
                                authors={currentAuthors}
                                users={currentUsers}
                                setBooks={setInitialBooks}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                            />
                        }
                    />
                }
            </Routes>
        </div>
    )
}

export default App;