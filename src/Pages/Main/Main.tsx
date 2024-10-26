import React from "react";
import styles from './Main.module.scss'
import DiscountPanel from "./DiscountPanel/DiscountPanel.tsx";

const Main = () => {
    return (
        <div className={styles.shopWrapper}>
            <DiscountPanel />
            <div className={styles.shopPanel}>
                <div className={styles.shopFilters}>
                    <div className={styles.filtersHeader}>
                        <button className={styles.backBtn} id="back">
                            <img className={styles.iconImageFilters} src="../pictures/arrow_12645576 (1).png" />
                                <div className={styles.filtersHeaderText}>Назад</div>
                        </button>
                        <button className={styles.removeFiltersBtn}>
                            <div className={styles.filtersHeaderText}>Сбросить все фильтры</div>
                        </button>
                    </div>
                </div>

                <div className={styles.shopContent}></div>
            </div>
        </div>
    )
}

export default Main;