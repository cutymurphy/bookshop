import React, { useState } from 'react'
import styles from './App.module.scss'
import Header from './Header/Header.tsx'
import { Cart, Main } from './Pages/index.ts';
import { Route, Router, Routes } from 'react-router-dom';

const App = () => {
    return (
        <div className={styles.wrapper}>
            <Header />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </div>
    )
}

export default App;