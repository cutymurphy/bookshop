import React, { FC } from "react";
import styles from './Header.module.scss'
import logoWithBookmark from '../assets/pictures/logo-with-bookmark.png';
import logoWithoutBookmark from '../assets/pictures/logo-without-bookmark.png';
import userIcon from '../assets/pictures/user_456283.png';
import settingsIcon from '../assets/pictures/settings.png';
import tgIcon from '../assets/pictures/app_14936955.png';
import cartIcon from '../assets/pictures/shopping-bag_1656850.png';
import slidersIcon from '../assets/pictures/sliders-v_10435878.png';
import HeaderForm from "../assets/components/HeaderForm/HeaderForm.tsx";
import { Link } from "react-router-dom";
import { EPath } from "../AppPathes.ts";
import { IHeader } from "./types.ts";
import clsx from "clsx";
import { ICartBook } from "../Pages/Cart/types.ts";

const Header: FC<IHeader> = ({
    productsInCart,
    setIsMobileFiltersOpen,
    setSearchInput,
    isAdmin,
}) => {
    const tgLink = "https://t.me/Ssushkova";

    const getCartCount = (): number => {
        let count = 0;
        productsInCart.forEach((product: ICartBook) => count += product.count);
        return count;
    }

    return (
        <header className={styles.header} id="header">
            <div className={styles.headInfo}>
                <div className={styles.logo}>
                    <Link to={EPath.main}>
                        <img className={styles.upperLayedLogo} src={logoWithoutBookmark} />
                        <img className={styles.bottomLayedLogo} src={logoWithBookmark} />
                    </Link>
                </div>
                <HeaderForm
                    setSearchInput={setSearchInput}
                />
                <div className={styles.icons}>
                    <div className={styles.userIconWrapper}>
                        <Link to={EPath.auth}>
                            {/* TO-DO: добавить работающий userName */}
                            <div className={styles.userName}></div>
                            <img className={styles.iconImage} src={userIcon} />
                        </Link>
                    </div>
                    {/* TO-DO: необходимо добавить вкладку с заказами для юзера */}
                    <div><a href={tgLink}><img className={styles.iconImage} src={tgIcon} /></a></div>
                    <div className={styles.cart}>
                        <Link to={EPath.cart}>
                            <div className={clsx(
                                styles.cartCount,
                                productsInCart.length === 0 && styles.cartCountDisabled,
                            )}>
                                {getCartCount()}
                            </div>
                            <img className={styles.iconImage} src={cartIcon} />
                        </Link>
                    </div>
                    {isAdmin &&
                        <div className={styles.userIconWrapper}>
                            <Link to={EPath.admin}>
                                <img className={styles.iconImage} src={settingsIcon} />
                            </Link>
                        </div>
                    }
                </div>
                <button
                    className={styles.menuFilter}
                    id="filter"
                    onClick={() => setIsMobileFiltersOpen(true)}
                >
                    <img className={styles.iconImageMenu} src={slidersIcon} />
                </button>
            </div>
        </header>
    )
}

export default Header;