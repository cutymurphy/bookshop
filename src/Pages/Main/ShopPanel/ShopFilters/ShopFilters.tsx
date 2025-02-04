import React, { FC } from 'react';
import styles from './ShopFilters.module.scss';
import arrowIcon from '../../../../assets/pictures/arrow_12645576 (1).png';
import { EFiltersNames, IFilter, IShopFilters } from './types';
import clsx from 'clsx';
import { initialPickedFilters } from '../../types.ts';
import Checkbox from '../../../../assets/components/Checkbox/Checkbox.tsx';

const ShopFilters: FC<IShopFilters> = ({
    filters,
    pickedFilters,
    setPickedFilters,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
}) => {
    const isAnyFilteresPicked = pickedFilters.some((filter: IFilter) => filter.filterItems.length > 0);

    const checkFilter = (isFilterChecked: boolean, name: EFiltersNames, item: string) => {
        setPickedFilters(pickedFilters.map((filter: IFilter) => {
            if (filter.name === name) {
                return (
                    {
                        ...filter,
                        filterItems: isFilterChecked ?
                            filter.filterItems.filter((filterItem: string) => item !== filterItem) :
                            [...filter.filterItems, item]
                    }
                )
            }
            return filter;
        }));
    };

    const resetFilters = () => {
        setPickedFilters([...initialPickedFilters]);
        setIsMobileFiltersOpen(false);
    }

    return (
        <div className={clsx(
            styles.shopFilters,
            isMobileFiltersOpen && styles["shopFilters-open"]
        )}>
            <div className={styles.filtersHeader}>
                <button
                    className={styles.backBtn}
                    id="back"
                    onClick={() => setIsMobileFiltersOpen(false)}
                >
                    <img className={styles.iconImageFilters} src={arrowIcon} alt='Иконка кнопки "назад"' />
                    <div className={styles.filtersHeaderText}>Назад</div>
                </button>
                <button
                    className={styles.removeFiltersBtn}
                    onClick={resetFilters}
                >
                    <div className={styles.filtersHeaderText}>Сбросить фильтры</div>
                </button>
            </div>
            {filters.map(({ name, filterItems }: IFilter, index: number) => (
                <div className={styles.filterItem} key={index}>
                    <div className={styles.filterItemName}>{name}</div>
                    <div className={styles.filterWrapper}>
                        {filterItems.map((item: string, i: number) => {
                            const isFilterChecked = pickedFilters.some((filter: IFilter) => filter.name === name && filter.filterItems.includes(item));

                            return (
                                <div className={styles.checkboxItem} key={i}>
                                    <Checkbox
                                        id={`checkbox_${index}_${i}`}
                                        onChange={() => checkFilter(isFilterChecked, name, item)}
                                        checked={isFilterChecked}
                                        className={styles.checkbox}
                                        classNameLabel={styles.checkboxLabel}
                                    />
                                    <label
                                        className={styles.checkboxText}
                                        htmlFor={`checkbox_${index}_${i}`}
                                    >
                                        {item}
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
            {isAnyFilteresPicked &&
                <button
                    className={styles.removeFiltersBtnDesktop}
                    onClick={resetFilters}
                >
                    <div className={styles.filtersHeaderText}>Сбросить фильтры</div>
                </button>
            }
        </div>
    )
}

export default ShopFilters;