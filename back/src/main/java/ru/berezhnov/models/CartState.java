package ru.berezhnov.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;

@Entity
@Table(name = "cart_state")
@Setter
@Getter
public class CartState implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

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
}
