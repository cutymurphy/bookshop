import React from "react";
import styles from './Header.module.scss'
import logoWithBookmark from '../assets/pictures/logo-with-bookmark.png';
import logoWithoutBookmark from '../assets/pictures/logo-without-bookmark.png';
import iconImageMenuUpper from '../assets/pictures/bars-staggered_9797761.png';
import iconImageMenuBottom from '../assets/pictures/cross_3917189.png';
import userIcon from '../assets/pictures/user_456283.png';
import tgIcon from '../assets/pictures/app_14936955.png';
import cartIcon from '../assets/pictures/shopping-bag_1656850.png';
import slidersIcon from '../assets/pictures/sliders-v_10435878.png';
import clsx from "clsx";
import HeaderForm from "../assets/components/HeaderForm/HeaderForm.tsx";
import { Link } from "react-router-dom";
import { EPath } from "../AppPathes.ts";

const Header = () => {
    const tgLink = "https://t.me/Ssushkova";

    return (
        <header className={styles.header} id="header">
            <div className={styles.headInfo}>
                <button className={styles.menuBurger} id="burger">
                    <img className={clsx(styles.iconImageMenu, styles.upper)} src={iconImageMenuUpper} />
                    <img className={clsx(styles.iconImageMenu, styles.bottom)} src={iconImageMenuBottom} />
                </button>
                <div className={styles.logo}>
                    <Link to={EPath.main}>
                        <img className={styles.upperLayedLogo} src={logoWithoutBookmark} />
                        <img className={styles.bottomLayedLogo} src={logoWithBookmark} />
                    </Link>
                </div>
                <HeaderForm />
                <div className={styles.icons}>
                    <div className={styles.userIconWrapper}><a href="authorization-page.html">
                        <div className={styles.userName}></div>
                        <img className={styles.iconImage} src={userIcon} />
                    </a></div>
                    <div><a href={tgLink}><img className={styles.iconImage} src={tgIcon} /></a></div>
                    <div className={styles.cart}>
                        <Link to={EPath.cart}>
                            <div className={styles.cartCount}></div>
                            <img className={styles.iconImage} src={cartIcon} />
                        </Link>
                    </div>
                </div>
                <button className={styles.menuFilter} id="filter">
                    <img className={styles.iconImageMenu} src={slidersIcon} />
                </button>
            </div>
        </header>
    )
}

export default Header;