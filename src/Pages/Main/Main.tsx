import React, { FC, useState } from "react";
import styles from './Main.module.scss'
import DiscountPanel from "./DiscountPanel/DiscountPanel.tsx";
import ShopFilters from "./ShopPanel/ShopFilters/ShopFilters.tsx";
import ShopContent from "./ShopPanel/ShopContent/ShopContent.tsx";
import { IMain, initialFilters, initialPickedFilters } from "./types.ts";
import { IFilter } from "./ShopPanel/ShopFilters/types.ts";

const Main: FC<IMain> = ({
    productsInCart,
    setProductsInCart,
}) => {
    const [filters, setFilters] = useState<IFilter[]>([...initialFilters]);
    const [pickedFilters, setPickedFilters] = useState<IFilter[]>([...initialPickedFilters]);

    return (
        <div className={styles.shopWrapper}>
            <DiscountPanel />
            <div className={styles.shopPanel}>
                <ShopFilters
                    filters={filters}
                    pickedFilters={pickedFilters}
                    setPickedFilters={setPickedFilters}
                />
                <div className={styles.shopContent}>
                    <ShopContent
                        productsInCart={productsInCart}
                        setProductsInCart={setProductsInCart}
                        pickedFilters={pickedFilters}
                        setFilters={setFilters}
                    />
                </div>
            </div>
        </div>
    )
}

export default Main;