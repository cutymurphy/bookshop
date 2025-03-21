package ru.berezhnov.dto;

import java.util.UUID;

public class CartStateDTO {
    private UUID bookInfo;
    private Integer count;

    public UUID getBookInfo() {
        return bookInfo;
    }

    public void setBookInfo(UUID bookInfo) {
        this.bookInfo = bookInfo;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}