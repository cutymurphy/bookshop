const express = require('express');
const cors = require('cors');
const db = require('./db.js');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM bookshop.book', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных');
        }
        res.json(results);
    });
});

app.get('/api/authors', (req, res) => {
    db.query('SELECT * FROM bookshop.author', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных');
        }
        res.json(results);
    });
});

app.post('/api/user', (req, res) => {
    const { name, surname, password, email, phone, itemsCount, totalCost, weight } = req.body;

    const id_user = uuidv4();
    const id_cart = id_user;

    const query = `
        INSERT INTO bookshop.user_with_cart (idUser, isAdmin, idCart, name, surname, password, email, phone, itemsCount, totalCost, weight) 
        VALUES (?, FALSE, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    db.query(query, [id_user, id_cart, name, surname, password, email, phone, itemsCount, totalCost, weight], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при добавлении пользователя');
        }

        res.status(201).json({ id_user, id_cart });
    });
});

app.put('/api/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, surname, password, email, phone, itemsCount, totalCost, weight } = req.body;

    const query = `
        UPDATE bookshop.user_with_cart 
        SET 
            name = COALESCE(?, name), 
            surname = COALESCE(?, surname), 
            password = COALESCE(?, password), 
            email = COALESCE(?, email), 
            phone = COALESCE(?, phone),
            itemsCount = COALESCE(?, itemsCount),
            totalCost = COALESCE(?, totalCost),
            weight = COALESCE(?, weight)
        WHERE idUser = ?;
    `;

    db.query(query, [name, surname, password, email, phone, itemsCount, totalCost, weight, id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при обновлении пользователя');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        res.status(200).json({ message: 'Пользователь успешно обновлен' });
    });
});

app.get('/api/user/email', (req, res) => {
    const { email } = req.query;

    const query = `SELECT * FROM bookshop.user_with_cart WHERE email = ?`;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных');
        }
        if (results.length === 0 || !results) {
            return res.json("");
        }
        res.json(results[0].id_user);
    });
});

app.get('/api/user/login', (req, res) => {
    const { email, password } = req.query;

    const query = `SELECT * FROM bookshop.user_with_cart WHERE email = ? AND password = ?`;

    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных');
        }
        if (results.length === 0 || !results) {
            return res.json("");
        }
        res.json(results[0]);
    });
});

app.get('/api/user/idUser', (req, res) => {
    const { idUser } = req.query;

    const query = `SELECT * FROM bookshop.user_with_cart WHERE idUser = ?`;

    db.query(query, [idUser], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных');
        }
        if (results.length === 0 || !results) {
            return res.json("");
        }
        res.json(results[0]);
    });
});


/* --------- CRUD for cart --------- */

app.get('/api/cartBook/:idCart', (req, res) => {
    const { idCart } = req.params;

    const query = `SELECT * FROM bookshop.cart_book WHERE idCart = ?`;

    db.query(query, [idCart], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении книг из корзины');
        }
        if (results.length === 0 || !results) {
            return res.json("");
        }
        res.json(results.map(({ bookCount, idBook }) => ({
            count: bookCount,
            idBook,
        })));
    });
});

app.post('/api/cartBook', (req, res) => {
    const { idCart, idBook } = req.body;

    const query = `
        INSERT INTO bookshop.cart_book (idCart, idBook) 
        VALUES (?, ?);
    `;

    db.query(query, [idCart, idBook], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send(`Ошибка при добавлении книги ${idBook} в корзину`);
        }

        res.status(201).json({ idCart, idBook });
    });
});

app.put('/api/cartBook/:idCart/:idBook', (req, res) => {
    const { idCart, idBook } = req.params;
    const { bookCount } = req.body;

    const query = `
        UPDATE bookshop.cart_book 
        SET bookCount = COALESCE(?, bookCount) 
        WHERE idCart = ? AND idBook = ?;
    `;

    db.query(query, [bookCount, idCart, idBook], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при обновлении количества книг в корзине');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Книга не найдена');
        }

        res.status(200).json({ message: `Количество книги ${idBook} успешно обновлено` });
    });
});

app.delete('/api/cartBook/:idCart/:idBook', (req, res) => {
    const { idCart, idBook } = req.params;

    const query = `DELETE FROM bookshop.cart_book WHERE idCart = ? AND idBook = ?`;

    db.query(query, [idCart, idBook], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса на удаление:', err);
            return res.status(500).send('Ошибка при удалении книги из корзины');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Запись для удаления не найдена');
        }

        res.status(200).json({ message: `Книга ${idBook} успешно удалена из корзины` });
    });
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Подключено к MySQL');
});