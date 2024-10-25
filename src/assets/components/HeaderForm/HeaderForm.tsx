import React from "react";
import styles from './HeaderForm.module.scss'

const HeaderForm = () => {
    return (
        <div className={styles.search}>
            <form className={styles.headerForm}>
                <input type="search" placeholder="Search..." autoFocus required />
                <button id="search" type="button">Go</button>
            </form>
        </div>
    )
}

export default HeaderForm;