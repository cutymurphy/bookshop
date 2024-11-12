import { FC, useEffect, useState } from "react";
import { IOrders } from "./types";
import styles from "./Orders.module.scss";
import React from "react";
import Badge from "../../assets/components/Badge/Badge.tsx";
import { getBadgeType } from "../Admin/OrdersPanel/utils.ts";
import { IOrder } from "../../types";
import PencilIcon from "../../assets/components/Icons/PencilIcon.tsx";
import { defaultPickupAddress, EStatusType } from "../Cart/CartModal/enums.ts";
import { ICartBook } from "../Cart/types.ts";
import ButtonAdmin from "../../assets/components/ButtonAdmin/ButtonAdmin.tsx";
import { deleteOrder } from "../../server/api.js";
import Loader from "../../assets/components/Loader/Loader.tsx";

const Orders: FC<IOrders> = ({
    orders,
    setOrders,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const sortedOrders = orders.sort((a: IOrder, b: IOrder) => {
        const [dateA, timeA] = a.date.split(", ");
        const [dayA, monthA, yearA] = dateA.split(".");
        const dateObjA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);

        const [dateB, timeB] = b.date.split(", ");
        const [dayB, monthB, yearB] = dateB.split(".");
        const dateObjB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

        return dateObjB.getTime() - dateObjA.getTime();
    });

    const handleDeleteOrder = async (id: string) => {
        setIsLoading(true);
        try {
            await deleteOrder(id);
            setOrders(orders.filter((order: IOrder) => id !== order.id));
        } catch (error) {
            console.error(`Ошибка при удалении заказа: ${error}`)
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [orders])

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.ordersWrapper}>
                <span className={styles.total}>Всего найдено: {orders.length} заказов</span>
                {sortedOrders.map(({ id, date, address, totalCost, payment, status, dateModified, books, message }: IOrder) => (
                    <div className={styles.order} key={id}>
                        <div className={styles.orderTitle}>
                            <span className={styles.title}>Заказ №{id}</span>
                            <Badge type={getBadgeType(status)}>{status}</Badge>
                        </div>
                        {dateModified &&
                            <div className={styles.modifyWrapper}>
                                <span>Дата последней модерации заказа: {dateModified}</span>
                                <PencilIcon color='var(--gray-purple)' height={11} />
                            </div>
                        }
                        <div className={styles.orderInfo}>
                            <div className={styles.info}>
                                <span>Дата заказа: <span className={styles.bolder}>{date}</span></span>
                                <span>Получение: <span className={styles.bolder}>{address !== defaultPickupAddress ? "Доставка" : "Самовывоз"}</span></span>
                                <span>Адрес получения: <span className={styles.bolder}>{address}</span></span>
                                <span>Стоимость: <span className={styles.bolder}>{totalCost} руб.</span></span>
                                <span>Оплата: <span className={styles.bolder}>{payment}</span></span>
                                {!!message &&
                                    <span>Сообщение администратора: <span className={styles.bolderMessage}>{message}</span></span>
                                }
                            </div>
                            <div className={styles.books}>
                                <span className={styles.booksTitle}>Книги в заказе:</span>
                                <div className={styles.booksWrapper}>
                                    {books.map(({ book, count }: ICartBook) => {
                                        const { id, name, imgLink, author } = book;

                                        return (
                                            <div className={styles.bookRow} key={id}>
                                                <img
                                                    className={styles.productImage}
                                                    src={imgLink}
                                                    alt={name}
                                                />
                                                <div className={styles.bookInfo}>
                                                    <div className={styles.bookTitle}>
                                                        <span className={styles.bookInfoName}>{name}</span>
                                                        {!!author && <span>{author}</span>}
                                                    </div>
                                                    <span className={styles.bookInfoCount}>Количество: {count}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        {status === EStatusType.placed &&
                            <ButtonAdmin
                                className={styles.btnCancel}
                                text="Отменить заказ"
                                fill={"outline"}
                                type={"gray"}
                                onClick={() => handleDeleteOrder(id)}
                            />
                        }
                    </div>
                ))}
            </div>
        )
    )
}

export default Orders;