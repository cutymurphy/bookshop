const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db.js');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


/* --------- CRUD for books --------- */

app.get('/api/book', (req, res) => {
    db.query('SELECT * FROM bookshop.book', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных о книгах');
        }
        res.json(results);
    });
});

app.post('/api/book', (req, res) => {
    const { id, idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType } = req.body;
    const newId = !!id ? id : uuidv4();

    const query = `
        INSERT INTO bookshop.book (id, idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    db.query(query, [newId, idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send(`Ошибка при добавлении новой книгиы`);
        }

        res.status(201).json(id);
    });
});

app.put('/api/book/:id', (req, res) => {
    const { id } = req.params;
    const { idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType } = req.body;
    
    const query = `
        UPDATE bookshop.book
        SET 
            idAdmin = ?, 
            count = ?, 
            dateModified = ?, 
            name = ?, 
            price = ?,
            category = ?,
            genre = ?,
            imgLink = ?,
            idAuthor = ?,
            pagesCount = ?,
            weight = ?,
            coverType = ?
        WHERE id = ?;
    `;

    db.query(query, [idAdmin, count, dateModified, name, price, category, genre, imgLink, idAuthor, pagesCount, weight, coverType, id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при обновлении книги');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Заказ не найден');
        }

        res.status(200).json(id);
    });
});

app.put('/api/bookCount/:idBook', (req, res) => {
    const { idBook } = req.params;
    const { bookCount } = req.body;

    const query = `
        UPDATE bookshop.book
        SET count = ? 
        WHERE id = ?;
    `;

    db.query(query, [bookCount, idBook], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при обновлении количества книг');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Книга не найдена');
        }

        res.status(200).json({ message: `Количество книги ${idBook} успешно обновлено` });
    });
});

app.delete('/api/book/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM bookshop.book WHERE id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса на удаление:', err);
            return res.status(500).send('Ошибка при удалении книги');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Запись для удаления не найдена');
        }

        res.status(200).json(id);
    });
});


/* --------- CRUD for authors --------- */

app.get('/api/authors', (req, res) => {
    db.query('SELECT * FROM bookshop.author', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных об авторах');
        }
        res.json(results);
    });
});


/* --------- CRUD for user --------- */

app.post('/api/user', async (req, res) => {
    const { name, surname, password, email, phone } = req.body;

    const id_user = uuidv4();
    const id_cart = id_user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO bookshop.user_with_cart (idUser, isAdmin, idCart, name, surname, password, email, phone) 
        VALUES (?, FALSE, ?, ?, ?, ?, ?, ?);
    `;

    db.query(query, [id_user, id_cart, name, surname, hashedPassword, email, phone], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при добавлении нового пользователя');
        }

        res.status(201).json(id_user);
    });
});

app.put('/api/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, surname, password, email, phone } = req.body;

    const query = `
        UPDATE bookshop.user_with_cart 
        SET 
            name = ?, 
            surname = ?, 
            password = ?, 
            email = ?, 
            phone = ?
        WHERE idUser = ?;
    `;

    db.query(query, [name, surname, password, email, phone, id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при обновлении пользователя');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        res.status(200).json(id);
    });
});

app.get('/api/user/email', (req, res) => {
    const { email } = req.query;

    const query = `SELECT * FROM bookshop.user_with_cart WHERE email = ?`;

    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении пользователя по email');
        }
        if (results.length === 0 || !results) {
            return res.json("");
        }
        res.json(results[0]);
    });
});

app.get('/api/user/login', (req, res) => {
    const { email, password } = req.query;

    const query = `SELECT * FROM bookshop.user_with_cart WHERE email = ?`;

    db.query(query, [email, password], async (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении пользователя');
        }
        if (results.length === 0 || !results) {
            return res.json("");
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return res.json(results[0]);
        }
        return res.json("");
    });
});

app.get('/api/user/idUser', (req, res) => {
    const { idUser } = req.query;

    const query = `SELECT * FROM bookshop.user_with_cart WHERE idUser = ?`;

    db.query(query, [idUser], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении пользователя по id');
        }
        if (results.length === 0 || !results) {
            return res.json("");
        }
        res.json(results[0]);
    });
});

app.get('/api/user', (req, res) => {
    db.query('SELECT * FROM bookshop.user_with_cart', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных о пользователях');
        }
        res.json(results);
    });
});

app.delete('/api/user/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM bookshop.user_with_cart WHERE idUser = ?`;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса на удаление:', err);
            return res.status(500).send('Ошибка при удалении пользователя');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Запись для удаления не найдена');
        }

        res.status(200).json(id);
    });
});


/* --------- CRUD for cart --------- */

app.get('/api/cartBook', (req, res) => {
    db.query('SELECT * FROM bookshop.cart_book', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении всех книг из всех корзин');
        }
        res.json(results);
    });
});

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
    const { idCart, idBook, bookCount } = req.body;

    const query = `
        INSERT INTO bookshop.cart_book (idCart, idBook, bookCount) 
        VALUES (?, ?, ?);
    `;

    db.query(query, [idCart, idBook, bookCount], (err, results) => {
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
        SET bookCount = ? 
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


/* --------- CRUD for cart states --------- */

app.post('/api/cartStates', (req, res) => {
    const { id, idBook, bookCount } = req.body;

    const query = `
        INSERT INTO bookshop.cart_states (id, idBook, bookCount) 
        VALUES (?, ?, ?);
    `;

    db.query(query, [id, idBook, bookCount], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send(`Ошибка при добавлении нового состояния`);
        }

        res.status(201).json(id);
    });
});

app.get('/api/cartStates/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM bookshop.cart_states WHERE id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении состояния корзины на момент заказа');
        }
        if (results.length === 0 || !results) {
            return res.json("");
        }
        res.json(results.map(({ idBook, bookCount }) => ({
            idBook,
            bookCount,
        })));
    });
});

app.get('/api/cartStates', (req, res) => {
    db.query('SELECT * FROM bookshop.cart_states', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении всех состояний корзин');
        }
        res.json(results);
    });
});

app.delete('/api/cartStates/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM bookshop.cart_states WHERE id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса на удаление:', err);
            return res.status(500).send('Ошибка при удалении состояния корзины');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Запись для удаления не найдена');
        }

        res.status(200).json(id);
    });
});


/* --------- CRUD for orders --------- */

app.post('/api/order', (req, res) => {
    const { id, number, idCartState, idUser, date, address, totalCost, payment, status } = req.body;
    const newId = !!id ? id : uuidv4();

    const query = `
        INSERT INTO bookshop.order (id, number, idCartState, idUser, idAdmin, date, address, totalCost, payment, status) 
        VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?);
    `;

    db.query(query, [newId, number, idCartState, idUser, date, address, totalCost, payment, status], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send(`Ошибка при добавлении нового заказа`);
        }

        res.status(201).json(id);
    });
});

app.put('/api/order/:id', (req, res) => {
    const { id } = req.params;
    const { idAdmin, dateModified, status, message } = req.body;
    
    const query = `
        UPDATE bookshop.order
        SET 
            idAdmin = ?, 
            dateModified = ?, 
            status = ?,
            message = ? 
        WHERE id = ?;
    `;

    db.query(query, [idAdmin, dateModified, status, message , id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при обновлении заказа');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Заказ не найден');
        }

        res.status(200).json(id);
    });
});

app.get('/api/order', (req, res) => {
    db.query('SELECT * FROM bookshop.order', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных о заказах');
        }
        res.json(results);
    });
});

app.delete('/api/order/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM bookshop.order WHERE id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса на удаление:', err);
            return res.status(500).send('Ошибка при удалении заказа');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Запись для удаления не найдена');
        }

        res.status(200).json(id);
    });
});


/* --------- CRUD for order count --------- */

app.get('/api/orderCount', (req, res) => {
    db.query('SELECT * FROM bookshop.order_count', (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при получении данных о количстве заказов');
        }
        res.json(results);
    });
});

app.put('/api/orderCount/:number', (req, res) => {
    const { number } = req.params;
    
    const query = `
        UPDATE bookshop.order_count
        SET count = ?;
    `;

    db.query(query, [number], (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка при обновлении общего числа заказов');
        }
        res.status(200).json(number);
    });
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Подключено к MySQL');
});