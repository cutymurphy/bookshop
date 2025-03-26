package ru.berezhnov.models;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.UUID;

@Entity
@Table(name = "cart_state")
public class CartState implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "book_id", referencedColumnName = "id")
    private Book book;

    @Column(name = "book_count")
    private Integer bookCount;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;

    public void setBook(Book book) {
        this.book = book;
        if (this.book.getCartStates() == null)
            this.book.setCartStates(new ArrayList<>());
        this.book.getCartStates().add(this);
    }

    public void setOrder(Order order) {
        this.order = order;
        if (this.order.getCartStates() == null)
            this.order.setCartStates(new ArrayList<>());
        this.order.getCartStates().add(this);
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public Order getOrder() {
        return order;
    }
}
