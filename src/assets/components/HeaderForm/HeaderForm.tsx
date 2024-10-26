import React, { FC, useEffect, useState } from "react";
import styles from './HeaderForm.module.scss'
import { IHeaderForm } from "./types";

const HeaderForm: FC<IHeaderForm> = ({
    setSearchInput,
}) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setSearchInput(inputValue);
        }
    }

    const setInput = () => {
        setSearchInput(inputValue);
    }

    useEffect(() => {
        if (inputValue === "") {
            setInput();
        }
    }, [inputValue])

    return (
        <div className={styles.search}>
            <form className={styles.headerForm}>
                <input
                    type="search"
                    placeholder="Search..."
                    autoFocus
                    required
                    onChange={(e) => setInputValue(String(e.target.value))}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                <button
                    id="search"
                    type="button"
                    onClick={setInput}
                >
                    Go
                </button>
            </form>
        </div>
    )
}

export default HeaderForm;