import React, { FormEvent, useState } from "react";
import styles from './Auth.module.scss';
import { IProfile } from "../../types";
import { addUser } from "../../server/api";
import Loader from "../../assets/components/Loader/Loader.tsx";
import { initialState } from "./types.ts";

const Auth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<IProfile>({ ...initialState });
    const [errors, setErrors] = useState<IProfile>({ ...initialState });

    const validate = (): boolean => {
        const newErrors = { ...initialState };
        let isValid = true;

        if (user.name.trim() === "") {
            newErrors.name = "Имя не может быть пустым";
            isValid = false;
        }

        if (user.surname.trim() === "") {
            newErrors.surname = "Фамилия не может быть пустой";
            isValid = false;
        }

        if (user.email.trim() === "") {
            newErrors.email = "Почта не может быть пустой";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = "Неверный формат email";
            isValid = false;
        }

        if (user.phone.trim() === "") {
            newErrors.phone = "Телефон не может быть пустым";
            isValid = false;
        } else if (!/^\+?\d{10,15}$/.test(user.phone)) {
            newErrors.phone = "Неверный формат телефона";
            isValid = false;
        }

        if (user.password.trim() === "") {
            newErrors.password = "Пароль не может быть пустым";
            isValid = false;
        } else if (user.password.length < 6) {
            newErrors.password = "Пароль должен содержать не менее 6 символов";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (validate()) {
                setIsLoading(true);
                const res = await addUser(user);
                console.log('Ответ от сервера:', res);
                setUser({ ...initialState });
                setErrors({ ...initialState });
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
        }
    }

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.wrapper}>
                <div className={styles.authWrapper}>
                    <h1>Регистрация</h1>
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authName}
                            type="text"
                            name="Name"
                            placeholder="Name"
                            required
                            onChange={(e) => {
                                setErrors({ ...errors, name: "" });
                                setUser({ ...user, name: String(e.target.value) });
                            }}
                        />
                        <i className='bx bxs-user'></i>
                        {!!errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authSurname}
                            type="text"
                            name="Surname"
                            placeholder="Surname"
                            required
                            onChange={(e) => {
                                setErrors({ ...errors, surname: "" });
                                setUser({ ...user, surname: String(e.target.value) });
                            }}
                        />
                        <i className='bx bxs-user'></i>
                        {!!errors.surname && <span className={styles.error}>{errors.surname}</span>}
                    </div>
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authEmail}
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            required
                            onChange={(e) => {
                                setErrors({ ...errors, email: "" });
                                setUser({ ...user, email: String(e.target.value) });
                            }}
                        />
                        <i className='bx bxs-envelope'></i>
                        {!!errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authPhone}
                            type="tel"
                            name="tel"
                            placeholder="Phone"
                            required
                            onChange={(e) => {
                                setErrors({ ...errors, phone: "" });
                                setUser({ ...user, phone: String(e.target.value) });
                            }}
                        />
                        <i className='bx bxs-phone'></i>
                        {!!errors.phone && <span className={styles.error}>{errors.phone}</span>}
                    </div>
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authPassword}
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            onChange={(e) => {
                                setErrors({ ...errors, password: "" });
                                setUser({ ...user, password: String(e.target.value) });
                            }}
                        />
                        <i className='bx bxs-lock-alt'></i>
                        {!!errors.password && <span className={styles.error}>{errors.password}</span>}
                    </div>
                    <div className={styles.rememberForgot}>
                        <label><input type="checkbox" /> Remember me</label>
                    </div>
                    <button
                        id="btn-sign-in"
                        className={styles.btn}
                        onClick={(e) => handleSubmit(e)}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        )
    )
}

export default Auth;