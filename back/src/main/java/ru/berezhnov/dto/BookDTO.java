package ru.berezhnov.dto;

import java.util.Date;
import java.util.UUID;

public class BookDTO {
    private UUID id;
    private UUID idAuthor;
    private UUID idAdmin;
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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getIdAuthor() {
        return idAuthor;
    }

    public void setIdAuthor(UUID idAuthor) {
        this.idAuthor = idAuthor;
    }

    public UUID getIdAdmin() {
        return idAdmin;
    }

    public void setIdAdmin(UUID idAdmin) {
        this.idAdmin = idAdmin;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Date getDateModified() {
        return dateModified;
    }

    public void setDateModified(Date dateModified) {
        this.dateModified = dateModified;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getPagesCount() {
        return pagesCount;
    }

    public void setPagesCount(Integer pagesCount) {
        this.pagesCount = pagesCount;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public String getImgLink() {
        return imgLink;
    }

    public void setImgLink(String imgLink) {
        this.imgLink = imgLink;
    }

    public String getCoverType() {
        return coverType;
    }

    public void setCoverType(String coverType) {
        this.coverType = coverType;
    }
}
