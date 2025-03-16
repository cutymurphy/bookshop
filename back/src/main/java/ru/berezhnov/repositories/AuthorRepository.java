package ru.berezhnov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.berezhnov.models.Author;

public interface AuthorRepository extends JpaRepository<Author, String> {
}
