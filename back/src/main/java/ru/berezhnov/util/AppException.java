package ru.berezhnov.util;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private String message;
    public AppException(String message) {
        this.message = message;
    }
}
