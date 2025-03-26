package ru.berezhnov.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.models.Book;
import ru.berezhnov.models.UserBook;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.BookRepository;
import ru.berezhnov.repositories.UserBookRepository;
import ru.berezhnov.repositories.UserRepository;
import ru.berezhnov.util.AppException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class UserBookService {

    private final UserBookRepository userBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Autowired
    public UserBookService(UserBookRepository userBookRepository, UserRepository userRepository, BookRepository bookRepository) {
        this.userBookRepository = userBookRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public List<UserBook> findAll() {
        return userBookRepository.findAll();
    }

    @Transactional
    public void updateBookCount(UUID idUser, UUID idBook, Integer bookCount) {
        UserBook userBook = userBookRepository.findByUserIdAndBookId(idUser, idBook).orElseThrow(()
                -> new AppException("Пользователь или книга не найден(а)"));
        userBook.setBookCount(bookCount);
    }

    @Transactional
    public void deleteByUserId(UUID id) {
        List<UserBook> userBooks = userBookRepository.findAllByUserId(id);
        if (userBooks.isEmpty()) {
            throw new AppException("У пользователя нет книг в корзине");
        }
        userBookRepository.deleteByUserId(id);
    }

    @Transactional
    public void addBookToCart(String email, UserBook userBook) {
        UserWithCart user = userRepository.findByEmail(email).orElseThrow(()
            -> new AppException("Пользователь не найден"));
        Book book = bookRepository.findById(userBook.getBook().getId()).orElseThrow(()
                -> new AppException("Книга не найдена"));
        if (userBookRepository.findByUserIdAndBookId(user.getId(), book.getId()).isPresent()) {
            throw new AppException("Книга уже в корзине у пользователя");
        }
        userBookRepository.save(userBook);
    }

    public List<Book> getUserBooksByUserId(UUID idUser) {
        return userBookRepository.findAllByUserId(idUser).stream().map(UserBook::getBook).toList();
    }

    @Transactional
    public void deleteBookFromCart(UUID idUser, UUID idBook) {
        UserBook userBook = userBookRepository.findByUserIdAndBookId(idUser, idBook).orElseThrow(() -> new AppException(
                "В корзине пользователя нет этой книги"));
        userBookRepository.delete(userBook);
    }
}
