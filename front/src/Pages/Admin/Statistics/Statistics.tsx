import { FC } from "react";
import React from "react";
import styles from "./Statistics.module.scss"
import { IStatistics } from "./types";
import { pluralizeWord } from "./utils.ts";

const Statistics: FC<IStatistics> = ({
    orders,
}) => {
    const orderCountByDate = orders.reduce((acc, order) => {
        const date = order.date.split(", ")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const orderStatistics = Object.entries(orderCountByDate).sort(([dateA], [dateB]) => {
        const [dayA, monthA, yearA] = dateA.split(".").map(Number);
        const [dayB, monthB, yearB] = dateB.split(".").map(Number);
        return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
    });

    return (
        <div className={styles.statisticsWrapper}>
            <div className={styles.statisticsRecord}>
                <span className={styles.statisticsTitle}>Общее количество сделанных заказов на сервисе:</span>
                <span>{orders.length} {pluralizeWord(orders.length)}</span>
            </div>
            <div className={styles.statisticsRecord}>
                <span className={styles.statisticsTitle}>Статистика заказов по датам:</span>
                <ul className={styles.statisticsList}>
                    {orderStatistics.map(([date, count]) => (
                        <li className={styles.point} key={date}>
                            <span>— </span>
                            <span className={styles.pointDate}>{date}:</span>
                            <span>{count} {pluralizeWord(count)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Statistics;