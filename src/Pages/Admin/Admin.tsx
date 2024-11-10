import React, { FC } from "react";
import { IAdmin } from "./types";
import styles from "./Admin.module.scss";
import Loader from "../../assets/components/Loader/Loader.tsx";
import Tabs from "../../assets/components/Tabs/Tabs.tsx";
import OrdersPanel from "./OrdersPanel/OrdersPanel.tsx";

const Admin: FC<IAdmin> = ({
    isLoading,
    orders,
    setOrders,
    setIsLoading,
}) => {
    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.adminWrapper}>
                <Tabs
                    tabsItems={[
                        {
                            title: "Заказы",
                            content: <OrdersPanel
                                orders={orders}
                                setOrders={setOrders}
                                setIsLoading={setIsLoading}
                            />
                        },
                        {
                            title: "Пользователи",
                            content: <div>Пользователи</div>
                        },
                        {
                            title: "Книги",
                            content: <div>Книги</div>
                        },
                        {
                            title: "Авторы",
                            content: <div>Авторы</div>,
                            disabled: true,
                        },
                    ]}
                />
            </div>
        )
    )
}

export default Admin;