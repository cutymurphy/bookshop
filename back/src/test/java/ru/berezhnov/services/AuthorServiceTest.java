package ru.berezhnov.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.berezhnov.models.Author;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.AuthorRepository;
import ru.berezhnov.repositories.UserRepository;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthorServiceTest {

    @Mock
    private AuthorRepository authorRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthorService authorService;

    @Test
    void findAll_ShouldReturnListOfAuthors() {
        List<Author> expectedAuthors = List.of(new Author(), new Author());
        when(authorRepository.findAll()).thenReturn(expectedAuthors);
        List<Author> result = authorService.findAll();
        assertEquals(expectedAuthors, result);
    }

    @Test
    void addAuthor_ShouldSetAdminAndDateModified_ThenSave() {
        UUID adminId = UUID.randomUUID();
        UserWithCart admin = new UserWithCart();
        admin.setId(adminId);
        Author author = new Author();
        author.setAdmin(new UserWithCart());
        author.getAdmin().setId(adminId);
        when(userRepository.findById(adminId)).thenReturn(Optional.of(admin));
        authorService.addAuthor(author);
        assertEquals(admin, author.getAdmin());
        assertNotNull(author.getDateModified());
        verify(authorRepository).save(author);
    }

    @Test
    void addAuthor_ShouldThrowException_WhenAdminNotFound() {
        Author author = new Author();
        UUID missingId = UUID.randomUUID();
        UserWithCart tempAdmin = new UserWithCart();
        tempAdmin.setId(missingId);
        author.setAdmin(tempAdmin);
        when(userRepository.findById(missingId)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authorService.addAuthor(author));
        assertEquals("Администратор не найден", ex.getMessage());
    }

    @Test
    void addAuthor_ShouldThrowException_WhenAdminIdIsNull() {
        Author author = new Author();
        UserWithCart admin = new UserWithCart();
        admin.setId(null);
        author.setAdmin(admin);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authorService.addAuthor(author));
        assertEquals("У автора должен быть указан админ с ID", ex.getMessage());
    }

    @Test
    void updateAuthor_ShouldCallAddAuthor_WhenAuthorExists() {
        UUID id = UUID.randomUUID();
        Author author = new Author();
        author.setId(id);
        UUID adminId = UUID.randomUUID();
        UserWithCart admin = new UserWithCart();
        admin.setId(adminId);
        author.setAdmin(admin);
        when(authorRepository.findById(id)).thenReturn(Optional.of(author));
        when(userRepository.findById(adminId)).thenReturn(Optional.of(admin));
        authorService.updateAuthor(author);
        verify(authorRepository).save(author);
    }

    @Test
    void updateAuthor_ShouldThrowException_WhenAuthorNotFound() {
        UUID id = UUID.randomUUID();
        Author author = new Author();
        author.setId(id);
        when(authorRepository.findById(id)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authorService.updateAuthor(author));
        assertEquals("Автор не найден", ex.getMessage());
    }

    @Test
    void updateAuthor_ShouldNotChangeAuthorId() {
        UUID originalId = UUID.randomUUID();
        Author dbAuthor = new Author();
        dbAuthor.setId(originalId);
        Author input = new Author();
        input.setId(originalId);
        input.setAdmin(new UserWithCart());
        input.getAdmin().setId(UUID.randomUUID());
        when(authorRepository.findById(originalId)).thenReturn(Optional.of(dbAuthor));
        when(userRepository.findById(any())).thenReturn(Optional.of(new UserWithCart()));
        authorService.updateAuthor(input);
        verify(authorRepository).save(argThat(saved -> saved.getId().equals(originalId)));
    }

    @Test
    void deleteById_ShouldDeleteAuthor_WhenFound() {
        UUID id = UUID.randomUUID();
        Author author = new Author();
        author.setId(id);
        when(authorRepository.findById(id)).thenReturn(Optional.of(author));
        authorService.deleteById(id);
        verify(authorRepository).delete(author);
    }

    @Test
    void deleteById_ShouldThrowException_WhenAuthorNotFound() {
        UUID id = UUID.randomUUID();
        when(authorRepository.findById(id)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authorService.deleteById(id));
        assertEquals("Автор не найден", ex.getMessage());
    }

    @Test
    void deleteById_ShouldNotDeleteWrongAuthor() {
        UUID correctId = UUID.randomUUID();
        UUID wrongId = UUID.randomUUID();
        Author wrongAuthor = new Author();
        wrongAuthor.setId(wrongId);
        when(authorRepository.findById(correctId)).thenReturn(Optional.of(wrongAuthor));
        authorService.deleteById(correctId);
        verify(authorRepository).delete(argThat(author -> author.getId().equals(wrongId)));
    }
}