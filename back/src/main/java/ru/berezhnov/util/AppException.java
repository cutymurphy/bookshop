package ru.berezhnov.util;

public class AppException extends RuntimeException {
    private String message;
    public AppException(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
}
