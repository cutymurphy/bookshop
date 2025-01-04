import React, { FC, useEffect, useState } from "react";
import { IAdmin } from "./types";
import styles from "./Admin.module.scss";
import Loader from "../../assets/components/Loader/Loader.tsx";
import Tabs from "../../assets/components/Tabs/Tabs.tsx";
import OrdersPanel from "./OrdersPanel/OrdersPanel.tsx";
import BooksPanel from "./BooksPanel/BooksPanel.tsx";
import { useSearchParams } from "react-router-dom";
import { ETabTitle } from "./enums.ts";
import UsersPanel from "./UsersPanel/UsersPanel.tsx";
import Statisctics from "./Statistics/Statistics.tsx";

const Admin: FC<IAdmin> = ({
    isLoading,
    orders,
    setOrders,
    ordersCount,
    setIsLoading,
    books,
    setBooks,
    authors,
    users,
    setUsers,
    currentAdmin,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    const handleTabChange = (index: number) => {
        setActiveTabIndex(index);

        switch (index) {
            case 0:
                setSearchParams({ tab: ETabTitle.orders });
                break;
            case 1:
                setSearchParams({ tab: ETabTitle.books });
                break;
            case 2:
                setSearchParams({ tab: ETabTitle.users });
                break;
            case 3:
                setSearchParams({ tab: ETabTitle.statistics });
                break;
            default:
                setSearchParams({ tab: ETabTitle.orders });
        }
    };

    useEffect(() => {
        const tab = searchParams.get("tab");

        switch (tab) {
            case ETabTitle.orders:
                setActiveTabIndex(0);
                break;
            case ETabTitle.books:
                setActiveTabIndex(1);
                break;
            case ETabTitle.users:
                setActiveTabIndex(2);
                break;
            case ETabTitle.statistics:
                setActiveTabIndex(3);
                break;
            default:
                setActiveTabIndex(0);
        }
    }, [searchParams]);

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.adminWrapper}>
                <Tabs
                    activeTabIndex={activeTabIndex}
                    onChange={(i: number) => handleTabChange(i)}
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
                            title: "Книги",
                            content: <BooksPanel
                                books={books}
                                setBooks={setBooks}
                                users={users}
                                setIsLoading={setIsLoading}
                            />
                        },
                        {
                            title: "Пользователи",
                            content: <UsersPanel
                                users={users}
                                setUsers={setUsers}
                                currentAdmin={currentAdmin}
                                setIsLoading={setIsLoading}
                            />
                        },
                        // {
                        //     title: "Авторы",
                        //     content: <div>Авторы</div>,
                        //     disabled: true,
                        // },
                        {
                            title: "Статистика",
                            content: <Statisctics
                                orders={orders}
                                ordersCount={ordersCount}
                            />
                        },
                    ]}
                />
            </div>
        )
    )
}

export default Admin;