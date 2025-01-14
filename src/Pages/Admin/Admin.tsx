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
import Statistics from "./Statistics/Statistics.tsx";
import AuthorsPanel from "./AuthorsPanel/AuthorsPanel.tsx";

const Admin: FC<IAdmin> = ({
    isLoading,
    orders,
    setOrders,
    allOrders,
    setIsLoading,
    books,
    setBooks,
    authors,
    setAuthors,
    users,
    setUsers,
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
                setSearchParams({ tab: ETabTitle.authors });
                break;
            case 3:
                setSearchParams({ tab: ETabTitle.users });
                break;
            case 4:
                setSearchParams({ tab: ETabTitle.statistics });
                break;
            default:
                setSearchParams({ tab: ETabTitle.orders });
        }
    };

    useEffect(() => {
        const tab = searchParams.get("tab");

        if (!Object.values(ETabTitle).includes(tab as ETabTitle)) {
            setSearchParams({ tab: ETabTitle.orders });
            return;
        }

        switch (tab) {
            case ETabTitle.orders:
                setActiveTabIndex(0);
                break;
            case ETabTitle.books:
                setActiveTabIndex(1);
                break;
            case ETabTitle.authors:
                setActiveTabIndex(2);
                break;
            case ETabTitle.users:
                setActiveTabIndex(3);
                break;
            case ETabTitle.statistics:
                setActiveTabIndex(4);
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
                            title: "Авторы",
                            content: <AuthorsPanel
                                authors={authors}
                                setAuthors={setAuthors}
                                books={books}
                                setIsLoading={setIsLoading}
                            />
                        },
                        {
                            title: "Пользователи",
                            content: <UsersPanel
                                users={users}
                                setUsers={setUsers}
                                orders={orders}
                                setOrders={setOrders}
                                setIsLoading={setIsLoading}
                            />
                        },
                        {
                            title: "Статистика",
                            content: <Statistics
                                orders={allOrders}
                            />
                        },
                    ]}
                />
            </div>
        )
    )
}

export default Admin;