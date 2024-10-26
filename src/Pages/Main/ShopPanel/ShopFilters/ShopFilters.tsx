import React from 'react';
import styles from './ShopFilters.module.scss';
import arrowIcon from '../../../../assets/pictures/arrow_12645576 (1).png';
import { IFilter } from './types';

const ShopFilters = () => {
    const createFilter = (name: string, filterItems: string[]): IFilter => {
        return {
            name,
            filterItems
        }
    }

    let filters = [
        createFilter("Выберите категорию:", ["Художественная литература", "Комиксы", "Манга", "Филология", "Детские книги", "Книги для подростков", "Медицина и здоровье", "Красота", "Наука", "Религия и философия", "Психология", "Экономика", "Искусство"]),
        createFilter("Происхождение книги:", ["Русская литература", "Зарубежная литература"]),
        createFilter("Тип переплета:", ["Мягкий", "Твёрдый"]),
        createFilter("Доступность:", ["В онлайн-магазине", "В магазинах моего города"])
    ];

    return (
        <div className={styles.shopFilters}>
            <div className={styles.filtersHeader}>
                <button className={styles.backBtn} id="back">
                    <img className={styles.iconImageFilters} src={arrowIcon} />
                    <div className={styles.filtersHeaderText}>Назад</div>
                </button>
                <button className={styles.removeFiltersBtn}>
                    <div className={styles.filtersHeaderText}>Сбросить все фильтры</div>
                </button>
            </div>
            {filters.map(({ name, filterItems }: IFilter, index: number) => (
                <div className={styles.filterItem} key={index}>
                    <div className={styles.filterItemName}>{name}</div>
                    <div className={styles.filterWrapper}>
                        {filterItems.map((item: string, i: number) => (
                            <div className={styles.checkboxItem}>
                                <div className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkboxInput}
                                        id={`checkbox_${index}_${i}`}
                                    />
                                    <label
                                        htmlFor={`checkbox_${index}_${i}`}
                                        className={styles.checkboxLabel}
                                    >
                                    </label>
                                </div>
                                <div className={styles.checkboxText}>
                                    {item}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ShopFilters;