import React from 'react'
import styles from './App.module.scss'
import Header from './Header/Header.tsx'

const App = () => {
    return (
        <div className={styles.wrapper}>
            <Header></Header>
        </div>
    )
}

export default App;