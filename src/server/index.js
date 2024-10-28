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
    const { name, surname, password, email, phone } = req.body;

    const id_user = uuidv4();
    const id_cart = id_user;

    const query = `
        INSERT INTO bookshop.user_with_cart (id_user, id_cart, name, surname, password, email, phone, items_count, total_cost, weight) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL);
    `;

    db.query(query, [id_user, id_cart, name, surname, password, email, phone], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при добавлении пользователя');
        }

        res.status(201).json({ id_user, id_cart });
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

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Подключено к MySQL');
});