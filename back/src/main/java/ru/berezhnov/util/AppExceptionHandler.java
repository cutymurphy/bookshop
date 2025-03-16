package ru.berezhnov.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AppExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<AppException> handleAppException(AppException e) {
        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
}