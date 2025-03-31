package ru.berezhnov.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.berezhnov.models.Author;
import ru.berezhnov.models.Book;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.AuthorRepository;
import ru.berezhnov.repositories.BookRepository;
import ru.berezhnov.repositories.UserRepository;
import ru.berezhnov.services.BookService;
import ru.berezhnov.util.AppException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private BookService bookService;

    private UserWithCart admin;
    private Author author;
    private Book book;

    @BeforeEach
    void setUp() {
        admin = new UserWithCart();
        admin.setId(UUID.randomUUID());

        author = new Author();
        author.setId(UUID.randomUUID());

        book = new Book();
        book.setId(UUID.randomUUID());
        book.setAdmin(admin);
        book.setAuthor(author);
        book.setCount(10);
    }

    @Test
    void testFindAll() {
        when(bookRepository.findAll()).thenReturn(Collections.singletonList(book));
        List<Book> books = bookService.findAll();
        assertFalse(books.isEmpty());
        assertEquals(1, books.size());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    void testAddBook_Success() {
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));
        when(authorRepository.findById(author.getId())).thenReturn(Optional.of(author));
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        assertDoesNotThrow(() -> bookService.addBook(book));
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void testAddBook_AdminNotFound() {
        when(userRepository.findById(admin.getId())).thenReturn(Optional.empty());
        Exception exception = assertThrows(AppException.class, () -> bookService.addBook(book));
        assertEquals("Администратор не найден", exception.getMessage());
    }

    @Test
    void testAddBook_AuthorNotFound() {
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));
        when(authorRepository.findById(author.getId())).thenReturn(Optional.empty());
        Exception exception = assertThrows(AppException.class, () -> bookService.addBook(book));
        assertEquals("Автор не найден", exception.getMessage());
    }

    @Test
    void testUpdateBook_Success() {
        when(bookRepository.findById(book.getId())).thenReturn(Optional.of(book));
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(admin));
        when(authorRepository.findById(author.getId())).thenReturn(Optional.of(author));

        assertDoesNotThrow(() -> bookService.updateBook(book));
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void testUpdateBook_BookNotFound() {
        when(bookRepository.findById(book.getId())).thenReturn(Optional.empty());
        Exception exception = assertThrows(AppException.class, () -> bookService.updateBook(book));
        assertEquals("Книга не найдена", exception.getMessage());
    }

    @Test
    void testUpdateBookCount_Success() {
        when(bookRepository.findById(book.getId())).thenReturn(Optional.of(book));
        assertDoesNotThrow(() -> bookService.updateBookCount(book.getId(), 5));
        assertEquals(5, book.getCount());
    }

    @Test
    void testUpdateBookCount_BookNotFound() {
        when(bookRepository.findById(book.getId())).thenReturn(Optional.empty());
        Exception exception = assertThrows(AppException.class, () -> bookService.updateBookCount(book.getId(), 5));
        assertEquals("Книга не найдена", exception.getMessage());
    }

    @Test
    void testDeleteById_Success() {
        when(bookRepository.findById(book.getId())).thenReturn(Optional.of(book));
        assertDoesNotThrow(() -> bookService.deleteById(book.getId()));
        verify(bookRepository, times(1)).delete(book);
    }

    @Test
    void testDeleteById_BookNotFound() {
        when(bookRepository.findById(book.getId())).thenReturn(Optional.empty());
        Exception exception = assertThrows(AppException.class, () -> bookService.deleteById(book.getId()));
        assertEquals("Книга не найдена", exception.getMessage());
    }
}