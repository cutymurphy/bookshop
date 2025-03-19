package ru.berezhnov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.berezhnov.models.Author;

@Repository
public interface AuthorRepository extends JpaRepository<Author, String> {
}
