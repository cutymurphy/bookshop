const express = require('express');
const cors = require('cors');
const db = require('./db.js');
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

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Подключено к MySQL');
});