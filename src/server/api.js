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