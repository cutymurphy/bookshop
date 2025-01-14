import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IOrderForm } from './types.ts';
import styles from "./OrderForm.module.scss";
import Loader from '../../../../assets/components/Loader/Loader.tsx';
import { ICartStateBook, IOrder } from '../../../../types.ts';
import PencilIcon from '../../../../assets/components/Icons/PencilIcon.tsx';
import DropDown from '../../../../assets/components/DropDown/DropDown.tsx';
import { defaultPickupAddress, EStatusType } from '../../../Cart/CartModal/enums.ts';
import Input from '../../../../assets/components/Input/Input.tsx';
import ButtonAdmin from '../../../../assets/components/ButtonAdmin/ButtonAdmin.tsx';
import ArrowLeftOutlineIcon from '../../../../assets/components/Icons/ArrowLeftOutlineIcon.tsx';
import { EPath } from '../../../../AppPathes.ts';
import Badge from '../../../../assets/components/Badge/Badge.tsx';
import { getBadgeType } from '../utils.ts';
import { IListOption } from '../../../../assets/components/DropDown/types.ts';
import { editOrder } from '../../../../server/api.js';
import { ETabTitle } from '../../enums.ts';
import { toast } from 'sonner';
import { deepCompare } from '../../utils.ts';

const OrderForm: FC<IOrderForm> = ({
    currentAdmin,
    orders,
    setOrders,
    isLoading,
    setIsLoading,
}) => {
    const { id = "" } = useParams<string>();
    const navigate = useNavigate();
    const [initialOrderInfo, setInitialOrderInfo] = useState<IOrder | null>(null);
    const [orderInfo, setOrderInfo] = useState<IOrder | null>(null);
    const [messageError, setMessageError] = useState<string>("");

    const isOrderChanged = !deepCompare(initialOrderInfo, orderInfo);

    const handleValidateOrder = () => {
        const message = orderInfo?.message?.trim();
        if (!!message && (message?.length < 5 || message?.length > 255)) {
            setMessageError("Длина сообщения: 5-255 символов");
        } else {
            handleChangeOrder();
        }
    }

    const handleChangeOrder = async () => {
        setIsLoading(true);
        try {
            const modifyDate = (new Date()).toLocaleString();
            const message = orderInfo?.message?.trim();

            await editOrder(orderInfo?.id, currentAdmin.idUser, modifyDate, orderInfo?.status, !!message ? message : null);
            setOrders(orders.map((order: IOrder) => {
                if (order.id !== orderInfo?.id) {
                    return order;
                }
                return {
                    ...orderInfo,
                    dateModified: modifyDate,
                    message,
                    idAdmin: currentAdmin.idUser,
                    admin: {
                        name: currentAdmin.name,
                        surname: currentAdmin.surname,
                    }
                };
            }))
            toast.success(`Информация о заказе №${orderInfo?.number} отредактирована`);
        } catch (error) {
            toast.error("Ошибка при редактировании заказа:", error);
        } finally {
            navigate(`${EPath.admin}?tab=${ETabTitle.orders}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const currentOrder = orders.find((order: IOrder) => order.id === id);
        if (!!currentOrder) {
            const changedFieldsOrder = Object.fromEntries(
                Object.entries(currentOrder).map(([key, value]) => [key, value === null ? "" : value])
            ) as IOrder;
            setOrderInfo({ ...changedFieldsOrder });
            setInitialOrderInfo({ ...changedFieldsOrder });
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [id, orders]);

    if (!orderInfo) {
        return (
            isLoading ? (
                <div className={styles.loadContainer}><Loader /></div>
            ) : (
                <div className={styles.formWrapper}>
                    <span className={styles.formTitle}>Заказ не найден.</span>
                </div>
            )
        );
    }

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.formWrapper}>
                <div>
                    <ButtonAdmin
                        text='Назад'
                        leftIcon={<ArrowLeftOutlineIcon />}
                        onClick={() => navigate(`${EPath.admin}?tab=${ETabTitle.orders}`)}
                        type={"gray"}
                    />
                </div>
                <div className={styles.formTitle}>
                    <span className={styles.title}>Редактирование заказа №{orderInfo.number}</span>
                    <Badge type={getBadgeType(initialOrderInfo?.status || EStatusType.placed)}>{initialOrderInfo?.status || EStatusType.placed}</Badge>
                </div>
                {orderInfo.dateModified &&
                    <div className={styles.modifyWrapper}>
                        <span>Последнее редактирование: {orderInfo.admin?.name} {orderInfo.admin?.surname}, {orderInfo.dateModified}</span>
                        <PencilIcon color='var(--gray-purple)' height={11} />
                    </div>
                }
                <div className={styles.fieldsWrapper}>
                    <DropDown
                        listOfOptions={Object.values(EStatusType).map((value: string) => ({
                            label: value,
                            value: value,
                        }))}
                        valuesToSelect={[orderInfo.status]}
                        label="Выберите статус"
                        requiredField
                        listClassName={styles.dropdownList}
                        onOptionChange={(({ value }: IListOption) => setOrderInfo({ ...orderInfo, status: value as EStatusType }))}
                    />
                    <Input
                        label="Комментарий к заказу"
                        placeholder="Товары недоступны... Доставка задерживается..."
                        value={orderInfo.message}
                        onChange={(e) => {
                            setMessageError("");
                            setOrderInfo({ ...orderInfo, message: e.target.value });
                        }}
                        errorMessage={messageError}
                    />
                </div>
                <div className={styles.btnsWrapper}>
                    <ButtonAdmin
                        text='Сохранить'
                        onClick={() => isOrderChanged ? handleValidateOrder() : toast.warning("Нет изменений для сохранения")}
                        type={"purple"}
                        fill={"outline"}
                        disabled={!isOrderChanged}
                    />
                    {isOrderChanged &&
                        <ButtonAdmin
                            text='Отменить'
                            onClick={() => {
                                setOrderInfo(initialOrderInfo);
                                setMessageError("");
                            }}
                            type={"gray"}
                        />
                    }
                </div>
                <div className={styles.orderInfoWrapper}>
                    <span className={styles.title}>Подробная информация о заказе:</span>
                    <div className={styles.orderInfo}>
                        <div className={styles.info}>
                            <span>Покупатель: <span className={styles.bolder}>{orderInfo.user.name} {orderInfo.user.surname}</span></span>
                            <span>Номер для связи: <span className={styles.bolder}>{orderInfo.user.phone}</span></span>
                            <span>Дата заказа: <span className={styles.bolder}>{orderInfo.date}</span></span>
                            <span>Получение: <span className={styles.bolder}>{orderInfo.address !== defaultPickupAddress ? "Доставка" : "Самовывоз"}</span></span>
                            <span>Адрес получения: <span className={styles.bolder}>{orderInfo.address}</span></span>
                            <span>Стоимость: <span className={styles.bolder}>{orderInfo.totalCost} руб.</span></span>
                            <span>Оплата: <span className={styles.bolder}>{orderInfo.payment}</span></span>
                        </div>
                        <div className={styles.books}>
                            <span className={styles.booksTitle}>Книги в заказе:</span>
                            <div className={styles.booksWrapper}>
                                {orderInfo.books.map(({ book, count }: ICartStateBook) => {
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
                </div>
            </div>
        )
    );
};

export default OrderForm;