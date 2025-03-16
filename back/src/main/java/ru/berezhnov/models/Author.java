package ru.berezhnov.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "author")
@Data
public class Author implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "surname")
    private String surname;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @ManyToOne
    @JoinColumn(name = "admin_id", referencedColumnName = "id")
    private UserWithCart admin;

    @Column(name = "date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date dateModified;

    @OneToMany(mappedBy = "author")
    @Cascade(CascadeType.ALL)
    private List<Book> books;

    public void setAdmin(UserWithCart admin) {
        this.admin = admin;
        if (this.admin.getAuthors() == null)
            this.admin.setAuthors(new ArrayList<>());
        this.admin.getAuthors().add(this);
    }
}
