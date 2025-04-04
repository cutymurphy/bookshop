package ru.berezhnov.services;

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

    @Test
    void addBook_ShouldThrowException_WhenAdminIsNull() {
        Book book = new Book();
        book.setAdmin(null);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> bookService.addBook(book));
        assertEquals("Администратор не может быть пустым", ex.getMessage());
    }

    @Test
    void addBook_ShouldThrowException_WhenAuthorIsNull() {
        Book book = new Book();
        UserWithCart admin = new UserWithCart(UUID.randomUUID());
        book.setAdmin(admin);
        book.setAuthor(null);
        when(userRepository.findById(admin.getId())).thenReturn(Optional.of(new UserWithCart()));
        RuntimeException ex = assertThrows(RuntimeException.class, () -> bookService.addBook(book));
        assertEquals("Автор не может быть пустым", ex.getMessage());
    }

    @Test
    void addBook_ShouldThrowException_WhenAdminNotFound() {
        UUID adminId = UUID.randomUUID();
        Book book = new Book();
        book.setAdmin(new UserWithCart());
        book.getAdmin().setId(adminId);
        UUID authorId = UUID.randomUUID();
        book.setAuthor(new Author());
        book.getAuthor().setId(authorId);
        when(userRepository.findById(adminId)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> bookService.addBook(book));
        assertEquals("Администратор не найден", ex.getMessage());
    }

    @Test
    void addBook_ShouldThrowException_WhenAuthorNotFound() {
        UUID adminId = UUID.randomUUID();
        Book book = new Book();
        book.setAdmin(new UserWithCart());
        book.getAdmin().setId(adminId);
        UUID authorId = UUID.randomUUID();
        book.setAuthor(new Author());
        book.getAuthor().setId(authorId);
        when(userRepository.findById(adminId)).thenReturn(Optional.of(new UserWithCart()));
        when(authorRepository.findById(authorId)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> bookService.addBook(book));
        assertEquals("Автор не найден", ex.getMessage());
    }

    @Test
    void updateBook_ShouldThrowException_WhenBookNotFound() {
        UUID bookId = UUID.randomUUID();
        Book book = new Book();
        book.setId(bookId);
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> bookService.updateBook(book));
        assertEquals("Книга не найдена", ex.getMessage());
    }

    @Test
    void updateBookCount_ShouldThrowException_WhenBookNotFound() {
        UUID bookId = UUID.randomUUID();
        Integer bookCount = 10;
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> bookService.updateBookCount(bookId, bookCount));
        assertEquals("Книга не найдена", ex.getMessage());
    }

    @Test
    void deleteById_ShouldThrowException_WhenBookNotFound() {
        UUID bookId = UUID.randomUUID();
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> bookService.deleteById(bookId));
        assertEquals("Книга не найдена", ex.getMessage());
    }

    @Test
    void updateBookCount_ShouldUpdateBookCount() {
        UUID bookId = UUID.randomUUID();
        Integer newCount = 15;
        Book book = new Book();
        book.setId(bookId);
        book.setCount(10);
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        bookService.updateBookCount(bookId, newCount);
        assertEquals(newCount, book.getCount());
    }
}