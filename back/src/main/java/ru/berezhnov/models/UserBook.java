package ru.berezhnov.models;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;

@Entity
@Table(name = "user_book")
public class UserBook implements Serializable {

    @EmbeddedId
    private UserBookKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserWithCart user;

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(name = "book_count")
    private Integer bookCount;

    @Column(name = "date")
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date date;

    public void setUser(UserWithCart user) {
        this.user = user;
        if (this.user.getUserBooks() == null)
            this.user.setUserBooks(new ArrayList<>());
        this.user.getUserBooks().add(this);
    }

    public void setBook(Book book) {
        this.book = book;
        if (this.book.getUserBooks() == null)
            this.book.setUserBooks(new ArrayList<>());
        this.book.getUserBooks().add(this);
    }

    public UserBookKey getId() {
        return id;
    }

    public void setId(UserBookKey id) {
        this.id = id;
    }

    public UserWithCart getUser() {
        return user;
    }

    public Book getBook() {
        return book;
    }

    public Integer getBookCount() {
        return bookCount;
    }

    public void setBookCount(Integer bookCount) {
        this.bookCount = bookCount;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
