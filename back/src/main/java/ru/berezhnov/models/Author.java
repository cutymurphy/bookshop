package ru.berezhnov.models;

import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "author")
public class Author implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

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

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public UserWithCart getAdmin() {
        return admin;
    }

    public Date getDateModified() {
        return dateModified;
    }

    public void setDateModified(Date dateModified) {
        this.dateModified = dateModified;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }

    public Author() {}

    public Author(UUID id) {
        this.id = id;
    }
}
