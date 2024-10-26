import React, { FC, useState } from "react";
import styles from './Main.module.scss'
import DiscountPanel from "./DiscountPanel/DiscountPanel.tsx";
import ShopFilters from "./ShopPanel/ShopFilters/ShopFilters.tsx";
import ShopContent from "./ShopPanel/ShopContent/ShopContent.tsx";
import { IMain, initialFilters, initialPickedFilters } from "./types.ts";
import { IFilter } from "./ShopPanel/ShopFilters/types.ts";
import clsx from "clsx";

const Main: FC<IMain> = ({
    productsInCart,
    setProductsInCart,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    searchInput,
}) => {
    const [filters, setFilters] = useState<IFilter[]>([...initialFilters]);
    const [pickedFilters, setPickedFilters] = useState<IFilter[]>([...initialPickedFilters]);

    return (
        <div className={clsx(
            styles.shopWrapper,
            isMobileFiltersOpen && styles.shopWrapperOpenFilters,
        )}>
            <DiscountPanel />
            <div className={styles.shopPanel}>
                <ShopFilters
                    filters={filters}
                    pickedFilters={pickedFilters}
                    setPickedFilters={setPickedFilters}
                    isMobileFiltersOpen={isMobileFiltersOpen}
                    setIsMobileFiltersOpen={setIsMobileFiltersOpen}
                />
                <div className={styles.shopContent}>
                    <ShopContent
                        productsInCart={productsInCart}
                        setProductsInCart={setProductsInCart}
                        pickedFilters={pickedFilters}
                        setFilters={setFilters}
                        searchInput={searchInput}
                    />
                </div>
            </div>
        </div>
    )
}

export default Main;