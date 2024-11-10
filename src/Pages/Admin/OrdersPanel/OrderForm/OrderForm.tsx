import React, { FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IOrderForm } from './types';
import styles from "./OrderForm.module.scss";
import Loader from '../../../../assets/components/Loader/Loader.tsx';

const OrderForm: FC<IOrderForm> = ({
    isLoading,
    setIsLoading,
}) => {
    const { id = "" } = useParams<string>();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [id]);

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.formWrapper}>
                {id}
            </div>
        )
    );
};

export default OrderForm;