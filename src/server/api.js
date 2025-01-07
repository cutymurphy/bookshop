const API_BASE_URL = 'http://localhost:3001/api';

export const fetchBooks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/book`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении книг:', error);
        throw error;
    }
};

export const addBook = async (id, idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при добавлении новой книги', error);
        throw error;
    }
};

export const editBook = async (id, idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType) => {
    try {
        const response = await fetch(`${API_BASE_URL}/book/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении книги', error);
        throw error;
    }
};

export const updateBookCount = async (idBook, bookCount) => {
    try {
        const response = await fetch(`${API_BASE_URL}/bookCount/${idBook}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookCount }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении количества книг', error);
        throw error;
    }
};

export const deleteBook = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/book/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при удалении книги', error);
        throw error;
    }
};

export const fetchAuthors = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/authors`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении авторов', error);
        throw error;
    }
};

export const fetchUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/user`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении пользователей', error);
        throw error;
    }
};

export const fetchOrders = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/order`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении заказов', error);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при добавлении пользователя', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении пользователя', error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/email?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении пользователя по email', error);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/idUser?idUser=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении пользователя по id', error);
        throw error;
    }
};

export const getUserByEmailAndPassword = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/login?email=${email}&password=${password}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении пользователя по email и паролю', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при удалении пользователя', error);
        throw error;
    }
};


/* --------- CRUD for cart functions --------- */

export const fetchCartBooks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartBook`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении корзин:', error);
        throw error;
    }
};

export const getCartBooksById = async (idCart) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartBook/${idCart}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении книг из корзины', error);
        throw error;
    }
};

export const addBookToCart = async (idCart, idBook, bookCount) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idCart, idBook, bookCount }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при добавлении книги в корзину', error);
        throw error;
    }
};

export const updateCartBookCount = async (idCart, idBook, bookCount) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartBook/${idCart}/${idBook}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookCount }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении количества книги в корзине', error);
        throw error;
    }
};

export const deleteBookFromCart = async (idCart, idBook) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartBook/${idCart}/${idBook}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при удалении книги из корзины', error);
        throw error;
    }
};

export const addCartState = async (id, idBook, bookCount) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartStates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, idBook, bookCount }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при добавлении нового состояния', error);
        throw error;
    }
};

export const fetchCartStates = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartStates`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении состояний корзин:', error);
        throw error;
    }
};

export const getCartStateBooksById = async (idCartState) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartStates/${idCartState}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении книг из состояния корзины', error);
        throw error;
    }
};

export const deleteCartState = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartStates/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при удалении состояния корзины', error);
        throw error;
    }
};

export const addOrder = async (id, number, idCartState, idUser, date, address, totalCost, payment, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, number, idCartState, idUser, date, address, totalCost, payment, status }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при добавлении нового заказа', error);
        throw error;
    }
};

export const editOrder = async (id, idAdmin, dateModified, status, message) => {
    try {
        const response = await fetch(`${API_BASE_URL}/order/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idAdmin, dateModified, status, message }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении пользователя', error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/order/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при удалении заказа', error);
        throw error;
    }
};

export const fetchOrdersCount = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/orderCount`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении числа заказов', error);
        throw error;
    }
};

export const editOrdersCount = async (number) => {
    try {
        const response = await fetch(`${API_BASE_URL}/orderCount/${number}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении числа заказов', error);
        throw error;
    }
};