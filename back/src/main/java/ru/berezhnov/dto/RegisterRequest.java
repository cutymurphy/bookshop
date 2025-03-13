package ru.berezhnov.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {
    private String name;
    private String surname;
    private String email;
    private String password;
    private String phone;
}
