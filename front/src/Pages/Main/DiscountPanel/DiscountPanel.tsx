import { Link } from 'react-router-dom';
import styles from './DiscountPanel.module.scss'
import React from 'react';

const DiscountPanel = () => {
    const link_1 = "https://content.img-gorod.ru/content/main-banner/3720-imageWeb-1.png?width=2400&height=800&fit=bounds";
    const link_2 = "https://content.img-gorod.ru/content/main-banner/3710-imageWeb-2.png?width=2400&height=800&fit=bounds";

    return (
        <div className={styles.discountPanel}>
            <div className={styles.discountCard}>
                <Link to="https://promokodikov.ru/shops/chitay-gorod/kulinarnaya-belaya-polosa/">
                    <img className={styles.discountImage}
                        src={link_1}
                        alt="Рекламный баннер «Кулинарная Белая полоса»" />
                </Link>
            </div>
            <div></div>
            <div className={styles.discountCard}>
                <Link to="https://eksmo.ru/">
                    <img className={styles.discountImage}
                        src={link_2}
                        alt="Рекламный баннер «Встречаем весну с Эскмо»" />
                </Link>
            </div>
        </div>
    )
}

export default DiscountPanel;