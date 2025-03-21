package ru.berezhnov.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.models.Author;
import ru.berezhnov.models.Book;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.AuthorRepository;
import ru.berezhnov.repositories.BookRepository;
import ru.berezhnov.repositories.UserRepository;
import ru.berezhnov.util.AppException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final AuthorRepository authorRepository;

    @Autowired
    public BookService(BookRepository bookRepository, UserRepository userRepository,
                       AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.authorRepository = authorRepository;
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Transactional
    public void addBook(Book book) {
        UserWithCart admin = userRepository.findById(book.getAdmin().getId())
                        .orElseThrow(() -> new AppException("Администратор не найден"));
        book.setAdmin(admin);
        Author author = authorRepository.findById(book.getAuthor().getId())
                        .orElseThrow(() -> new AppException("Автор не найден"));
        book.setAuthor(author);
        bookRepository.save(book);
    }

    @Transactional
    public void updateBook(Book book) {
        bookRepository.findById(book.getId())
                .orElseThrow(() -> new AppException("Книга не найдена"));
        this.addBook(book);
    }

    @Transactional
    public void updateBookCount(UUID idBook, Integer bookCount) {
        Book book = bookRepository.findById(idBook).orElseThrow(() -> new AppException("Книга не найдена"));
        book.setCount(bookCount);
    }

    @Transactional
    public void deleteById(UUID id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new AppException("Книга не найдена"));
        bookRepository.delete(book);
    }
}
