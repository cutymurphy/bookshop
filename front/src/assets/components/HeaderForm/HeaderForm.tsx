import React, { FC, useEffect, useState } from "react";
import styles from "./HeaderForm.module.scss";
import { IHeaderForm } from "./types";
import { useLocation, useNavigate } from "react-router-dom";
import { EPath } from "../../../AppPathes.ts";

const HeaderForm: FC<IHeaderForm> = ({
    setSearchInput,
}) => {
    const [inputValue, setInputValue] = useState<string>("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== EPath.main) {
            setInputValue("");
            setSearchInput("");
        }
    }, [location.pathname, setSearchInput]);

    const clickSearch = () => {
        if (location.pathname !== EPath.main) {
            navigate(EPath.main);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setSearchInput(inputValue);
        }
    };

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
            <form className={styles.headerForm} onClick={clickSearch}>
                <input
                    value={inputValue}
                    type="search"
                    placeholder="Search..."
                    autoFocus
                    required
                    onChange={(e) => setInputValue(String(e.target.value))}
                    onKeyDown={handleKeyDown}
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
    );
};

export default HeaderForm;