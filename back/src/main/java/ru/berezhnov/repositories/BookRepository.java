package ru.berezhnov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.berezhnov.models.Book;

public interface BookRepository extends JpaRepository<Book, String> {
}
