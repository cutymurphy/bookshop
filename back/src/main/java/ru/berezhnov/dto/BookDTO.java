package ru.berezhnov.dto;

import lombok.Data;

import java.util.Date;

@Data
public class BookDTO {
    private String id;
    private String idAuthor;
    private String idAdmin;
    private Integer count;
    private Date dateModified;
    private String name;
    private Double price;
    private String category;
    private String genre;
    private Integer pagesCount;
    private Integer weight;
    private String imgLink;
    private String coverType;
}
