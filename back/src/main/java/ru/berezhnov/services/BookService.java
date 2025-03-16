package ru.berezhnov.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final AuthorRepository authorRepository;

    public List<BookDTO> getAll() {
        return bookRepository.findAll().stream().map(this::getBookDTO)
                .collect(Collectors.toList());
    }

    private BookDTO getBookDTO(Book book) {
        BookDTO bookDTO = modelMapper.map(book, BookDTO.class);
        bookDTO.setIdAdmin(book.getAdmin().getId());
        bookDTO.setIdAuthor(book.getAuthor().getId());
        return bookDTO;
    }

    private Book getBook(BookDTO bookDTO) {
        return modelMapper.map(bookDTO, Book.class);
    }

    @Transactional
    public void addBook(BookDTO bookDTO) {
        Book book = getBook(bookDTO);
        UserWithCart admin = userRepository.findById(bookDTO.getIdAdmin())
                        .orElseThrow(() -> new AppException("Admin not found"));
        book.setAdmin(admin);
        Author author = authorRepository.findById(bookDTO.getIdAuthor())
                        .orElseThrow(() -> new AppException("Author not found"));
        book.setAuthor(author);
        bookRepository.save(book);
    }

    @Transactional
    public void updateBook(BookDTO bookDTO) {
        bookRepository.findById(bookDTO.getId())
                .orElseThrow(() -> new AppException("Book not found"));
        this.addBook(bookDTO);
    }

    @Transactional
    public void updateBookCount(String idBook, Integer bookCount) {
        Book book = bookRepository.findById(idBook).orElseThrow(() -> new AppException("Book not found"));
        book.setCount(bookCount);
    }

    @Transactional
    public void deleteById(String id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new AppException("Book not found"));
        bookRepository.delete(book);
    }
}
