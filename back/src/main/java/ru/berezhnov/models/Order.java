package ru.berezhnov.models;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "_order")
public class Order implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(name = "number")
    private Integer number;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserWithCart user;

    @Column(name = "date")
    private Date date;

    @Column(name = "address")
    private String address;

    @Column(name = "total_cost")
    private Double totalCost;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "admin_id", referencedColumnName = "id")
    private UserWithCart admin;

    @Column(name = "date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date dateModified;

    @Column(name = "message")
    private String message;

    @OneToMany(mappedBy = "order")
    private List<CartState> cartStates;

    public void setUser(UserWithCart user) {
        this.user = user;
        if (this.user.getOrders() == null)
            this.user.setOrders(new ArrayList<>());
        this.user.getOrders().add(this);
    }

    public void setAdmin(UserWithCart admin) {
        this.admin = admin;
        if (this.admin.getOrders() == null)
            this.admin.setOrders(new ArrayList<>());
        this.admin.getOrders().add(this);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public UserWithCart getUser() {
        return user;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDateModified() {
        return dateModified;
    }

    public void setDateModified(Date dateModified) {
        this.dateModified = dateModified;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserWithCart getAdmin() {
        return admin;
    }

    public List<CartState> getCartStates() {
        return cartStates;
    }

    public void setCartStates(List<CartState> cartStates) {
        this.cartStates = cartStates;
    }
}
