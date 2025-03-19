package ru.berezhnov.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.dto.BookDTO;
import ru.berezhnov.models.Author;
import ru.berezhnov.models.Book;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.AuthorRepository;
import ru.berezhnov.repositories.BookRepository;
import ru.berezhnov.repositories.UserRepository;
import ru.berezhnov.util.AppException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final AuthorRepository authorRepository;

    @Autowired
    public BookService(BookRepository bookRepository, ModelMapper modelMapper, UserRepository userRepository,
                       AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.authorRepository = authorRepository;
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    private Book getBook(BookDTO bookDTO) {
        return modelMapper.map(bookDTO, Book.class);
    }

    @Transactional
    public void addBook(BookDTO bookDTO) {
        Book book = getBook(bookDTO);
        UserWithCart admin = userRepository.findById(bookDTO.getIdAdmin())
                        .orElseThrow(() -> new AppException("Администратор не найден"));
        book.setAdmin(admin);
        Author author = authorRepository.findById(bookDTO.getIdAuthor())
                        .orElseThrow(() -> new AppException("Автор не найден"));
        book.setAuthor(author);
        bookRepository.save(book);
    }

    @Transactional
    public void updateBook(BookDTO bookDTO) {
        bookRepository.findById(bookDTO.getId())
                .orElseThrow(() -> new AppException("Книга не найдена"));
        this.addBook(bookDTO);
    }

    @Transactional
    public void updateBookCount(String idBook, Integer bookCount) {
        Book book = bookRepository.findById(idBook).orElseThrow(() -> new AppException("Книга не найдена"));
        book.setCount(bookCount);
    }

    @Transactional
    public void deleteById(String id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new AppException("Книга не найдена"));
        bookRepository.delete(book);
    }
}
