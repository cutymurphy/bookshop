package ru.berezhnov.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "_order")
@Getter
@Setter
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
}
