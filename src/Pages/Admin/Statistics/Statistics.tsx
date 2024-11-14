import { FC } from "react";
import React from "react";
import styles from "./Statistics.module.scss"
import { IStatistics } from "./types";

const Statistics: FC<IStatistics> = ({
    orders,
}) => {
    const orderCountByDate = orders.reduce((acc, order) => {
        const date = order.date.split(", ")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const orderStatistics = Object.entries(orderCountByDate);

    const pluralizeWord = (number: number): string => {
        if (number % 10 === 1 && number % 100 !== 11) {
            return 'заказ';
        } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
            return 'заказа';
        } else {
            return 'заказов';
        }
    }

    return (
        <div className={styles.statisticsWrapper}>
            <span className={styles.statisticsTitle}>Статистика заказов по датам:</span>
            <ul className={styles.statisticsList}>
                {orderStatistics.map(([date, count]) => (
                    <li className={styles.point} key={date}>
                        <span className={styles.pointDate}>— {date}:</span>
                        <span>{count} {pluralizeWord(count)}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Statistics;