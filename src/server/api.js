const API_BASE_URL = 'http://localhost:3001/api';

export const fetchBooks = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении книг:', error);
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


/* --------- CRUD for cart functions --------- */

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

export const addBookToCart = async (idCart, idBook) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idCart, idBook }),
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

export const addCartState = async (id, idUser, idBook, bookCount) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cartStates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, idUser, idBook, bookCount }),
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

export const addOrder = async (idCartState, date, address, payment, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idCartState, date, address, payment, status }),
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