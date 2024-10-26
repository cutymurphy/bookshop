import React, { useState } from 'react'
import styles from './App.module.scss'
import Header from './Header/Header.tsx'
import { Cart, Main } from './Pages/index.ts';
import { Route, Routes } from 'react-router-dom';
import { IBook } from './Pages/Main/ShopPanel/ShopContent/types.ts';

const App = () => {
    const [productsInCart, setProductsInCart] = useState<IBook[]>([]);

    return (
        <div className={styles.wrapper}>
            <Header
                productsInCart={productsInCart}
            />
            <Routes>
                <Route path="/" element={
                    <Main
                        productsInCart={productsInCart}
                        setProductsInCart={setProductsInCart}
                    />
                } />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </div>
    )
}

export default App;