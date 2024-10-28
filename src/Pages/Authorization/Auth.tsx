import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from './Auth.module.scss';
import { IProfile } from "../../types";
import { addUser, getUserByEmail } from "../../server/api";
import Loader from "../../assets/components/Loader/Loader.tsx";
import { initialState } from "./types.ts";
import { useNavigate } from "react-router-dom";
import { EPath } from "../../AppPathes.ts";

const Auth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(true);
    const [user, setUser] = useState<IProfile>({ ...initialState });
    const [errors, setErrors] = useState<IProfile>({ ...initialState });
    const [errorExist, setErrorExist] = useState<string>("");
    const navigate = useNavigate();

    const handleChangeField = (field: keyof IProfile, e: ChangeEvent<HTMLInputElement>) => {
        setErrors({ ...errors, [field]: "" });
        setErrorExist("");
        setUser({ ...user, [field]: String(e.target.value) });
    };

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
                const userByEmail = await getUserByEmail(user.email);
                if (!userByEmail) {
                    await addUser(user);
                    navigate(EPath.main);
                } else {
                    setErrorExist("Такой пользователь уже существует");
                }
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

    useEffect(() => {
        setUser({ ...initialState });
        setErrors({ ...initialState });
        setErrorExist("");
    }, [isSignUp])

    return (
        isLoading ? (
            <div className={styles.loadContainer}><Loader /></div>
        ) : (
            <div className={styles.wrapper}>
                <div className={styles.authWrapper} key={isSignUp ? "signUp" : "signIn"}>
                    <h1>{isSignUp ? "Регистрация" : "Войти"}</h1>
                    {isSignUp && <div className={styles.inputBox}>
                        <input
                            className={styles.authName}
                            type="text"
                            name="Name"
                            placeholder="Name"
                            onChange={(e) => handleChangeField("name", e)}
                        />
                        <i className='bx bxs-user'></i>
                        {!!errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>}
                    {isSignUp && <div className={styles.inputBox}>
                        <input
                            className={styles.authSurname}
                            type="text"
                            name="Surname"
                            placeholder="Surname"
                            onChange={(e) => handleChangeField("surname", e)}
                        />
                        <i className='bx bxs-user'></i>
                        {!!errors.surname && <span className={styles.error}>{errors.surname}</span>}
                    </div>}
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authEmail}
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            onChange={(e) => handleChangeField("email", e)}
                        />
                        <i className='bx bxs-envelope'></i>
                        {!!errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                    {isSignUp && <div className={styles.inputBox}>
                        <input
                            className={styles.authPhone}
                            type="tel"
                            name="tel"
                            placeholder="Phone"
                            onChange={(e) => handleChangeField("phone", e)}
                        />
                        <i className='bx bxs-phone'></i>
                        {!!errors.phone && <span className={styles.error}>{errors.phone}</span>}
                    </div>}
                    <div className={styles.inputBox}>
                        <input
                            className={styles.authPassword}
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e) => handleChangeField("password", e)}
                        />
                        <i className='bx bxs-lock-alt'></i>
                        {!!errors.password && <span className={styles.error}>{errors.password}</span>}
                    </div>
                    {!!errorExist && <span className={styles.errorExist}>{errorExist}</span>}
                    <button
                        className={styles.btn}
                        onClick={(e) => handleSubmit(e)}
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                </div>
                <div className={styles.changeAuthMethodWrapper}>
                    <span className={styles.textNew}>{isSignUp ? "Already have an account?" : "New to TimeForBook?"}</span>
                    <span
                        className={styles.textChangeAuth}
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? "Sign in" : "Create an account"}
                    </span>
                </div>
            </div>
        )
    )
}

export default Auth;