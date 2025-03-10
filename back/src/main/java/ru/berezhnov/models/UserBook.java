package ru.berezhnov.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.ArrayList;
import java.util.Date;

@Entity
@Table(name = "user_book")
@Setter
@Getter
public class UserBook {

    @EmbeddedId
    private UserBookKey id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "id_user")
    private UserWithCart user;

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "id_book")
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
}
