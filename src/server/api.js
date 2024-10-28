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