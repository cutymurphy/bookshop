import React, { FC } from "react";
import styles from './Main.module.scss'
import DiscountPanel from "./DiscountPanel/DiscountPanel.tsx";
import ShopFilters from "./ShopPanel/ShopFilters/ShopFilters.tsx";
import ShopContent from "./ShopPanel/ShopContent/ShopContent.tsx";
import { IMain } from "./types.ts";

const Main: FC<IMain> = ({
    productsInCart,
    setProductsInCart,
}) => {
    return (
        <div className={styles.shopWrapper}>
            <DiscountPanel />
            <div className={styles.shopPanel}>
                <ShopFilters />
                <div className={styles.shopContent}>
                    <ShopContent
                        productsInCart={productsInCart}
                        setProductsInCart={setProductsInCart}
                    />
                </div>
            </div>
        </div>
    )
}

export default Main;