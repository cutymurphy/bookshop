package ru.berezhnov.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.models.Author;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.AuthorRepository;
import ru.berezhnov.repositories.UserRepository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final UserRepository userRepository;

    @Autowired
    public AuthorService(AuthorRepository authorRepository, UserRepository userRepository) {
        this.authorRepository = authorRepository;
        this.userRepository = userRepository;
    }

    public List<Author> findAll() {
        return authorRepository.findAll();
    }

    @Transactional
    public void addAuthor(Author author) {
        if (author.getAdmin() == null || author.getAdmin().getId() == null) {
            throw new IllegalArgumentException("У автора должен быть указан админ с ID");
        }
        UserWithCart admin = userRepository.findById(author.getAdmin().getId())
                .orElseThrow(() -> new RuntimeException("Администратор не найден"));
        author.setAdmin(admin);
        author.setDateModified(new Date());
        authorRepository.save(author);
    }

    @Transactional
    public void updateAuthor(Author author) {
        authorRepository.findById(author.getId()).orElseThrow(() -> new RuntimeException("Автор не найден"));
        this.addAuthor(author);
    }

    @Transactional
    public void deleteById(UUID id) {
        Author authorToDelete = authorRepository.findById(id).orElseThrow(() -> new RuntimeException("Автор не найден"));
        authorRepository.delete(authorToDelete);
    }
}
