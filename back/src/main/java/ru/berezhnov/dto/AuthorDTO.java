package ru.berezhnov.dto;

import lombok.Data;

import java.util.Date;

@Data
public class AuthorDTO {
    private String id;
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String idAdmin;
    private Date dateModified;
}
