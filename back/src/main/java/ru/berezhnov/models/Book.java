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
@Table(name = "book")
@Getter
@Setter
public class Book implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @ManyToOne
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    private Author author;

    @ManyToOne
    @JoinColumn(name = "admin_id", referencedColumnName = "id")
    private UserWithCart admin;

    @Column(name = "count")
    private Integer count;

    @Column(name = "date_modified")
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date dateModified;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "category")
    private String category;

    @Column(name = "genre")
    private String genre;

    @Column(name = "pages_count")
    private Integer pagesCount;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "img_link")
    private String imgLink;

    @Column(name = "cover_type")
    private String coverType;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<UserBook> userBooks;

    @OneToMany(mappedBy = "book")
    private List<CartState> cartStates;

    public void setAuthor(Author author) {
        this.author = author;
        if (this.author.getBooks() == null)
            this.author.setBooks(new ArrayList<>());
        this.author.getBooks().add(this);
    }

    public void setAdmin(UserWithCart admin) {
        this.admin = admin;
        if (this.admin.getBooks() == null)
            this.admin.setBooks(new ArrayList<>());
        this.admin.getBooks().add(this);
    }
}
