package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.BookCountRequest;
import ru.berezhnov.dto.BookDTO;
import ru.berezhnov.dto.UserBookDTO;
import ru.berezhnov.models.Book;
import ru.berezhnov.models.UserBook;
import ru.berezhnov.services.UserBookService;
import ru.berezhnov.services.UserService;
import ru.berezhnov.util.EmailExtractor;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cartBook")
public class UserBookController {

    private final UserBookService userBookService;
    private final ModelMapper modelMapper;
    private final EmailExtractor emailExtractor;
    private final UserService userService;

    @Autowired
    public UserBookController(UserBookService userBookService, ModelMapper modelMapper, EmailExtractor emailExtractor,
                              UserService userService) {
        this.userBookService = userBookService;
        this.modelMapper = modelMapper;
        this.emailExtractor = emailExtractor;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserBookDTO>> fetchCartBooks() {//+
        return ResponseEntity.ok(userBookService.findAll().stream().map(this::convertToUserBookDTO).toList());
    }

    private UserBookDTO convertToUserBookDTO(UserBook userBook) {
        UserBookDTO userBookDTO = modelMapper.map(userBook, UserBookDTO.class);
        userBookDTO.setBook(userBook.getId().getBookId());
        userBookDTO.setUser(userBook.getId().getUserId());
        return userBookDTO;
    }

    @PutMapping("/{idCart}/{idBook}")
    public ResponseEntity<?> updateCartBookCount(@PathVariable UUID idCart, @PathVariable UUID idBook,
                                                 @RequestBody BookCountRequest bookCountRequest) {//+
        userBookService.updateBookCount(idCart, idBook, bookCountRequest.getBookCount());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserBook(@PathVariable UUID id) {//+ deleteCart()
        userBookService.deleteByUserId(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<?> addBookToCart(@RequestHeader("Authorization") String authHeader,
                                           @RequestBody UserBookDTO userBookDTO) {//+
        userBookService.addBookToCart(emailExtractor.getUserFromHeader(authHeader).getEmail(),
                convertToUserBook(userBookDTO));
        return ResponseEntity.ok().build();
    }

    private UserBook convertToUserBook(UserBookDTO userBookDTO) {
        UserBook userBook = modelMapper.map(userBookDTO, UserBook.class);
        userBook.setBook(new Book(userBookDTO.getBook()));
        return userBook;
    }

    @GetMapping("/{idUser}")
    public ResponseEntity<List<BookDTO>> getCartBooksById(@PathVariable UUID idUser) {//+
        return ResponseEntity.ok(userBookService.getUserBooksByUserId(idUser).stream().map(this::convertToBookDTO)
                .toList());
    }

    @GetMapping("/jwt")
    public ResponseEntity<List<BookDTO>> getCartBooksByUserJwt(@RequestHeader("Authorization") String authHeader) {//+
        return ResponseEntity.ok(userService.findByEmail(emailExtractor.getUserFromHeader(authHeader).getEmail())
                .orElseThrow(() -> new RuntimeException("Неверный Jwt")).getUserBooks().stream().map(UserBook::getBook)
                .map(this::convertToBookDTO).toList());
    }

    private BookDTO convertToBookDTO(Book book) {
        BookDTO bookDTO = modelMapper.map(book, BookDTO.class);
        bookDTO.setIdAdmin(book.getAdmin().getId());
        bookDTO.setIdAuthor(book.getAuthor().getId());
        return bookDTO;
    }

    @DeleteMapping("/{idUser}/{idBook}")
    public ResponseEntity<?> deleteBookFromCart(@PathVariable UUID idUser, @PathVariable UUID idBook) {//+
        userBookService.deleteBookFromCart(idUser, idBook);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{idBook}/jwt")
    public ResponseEntity<?> deleteBookFromCart(@PathVariable UUID idBook,
                                                @RequestHeader("Authorization") String authHeader) {//+
        userBookService.deleteBookFromCart(userService.findByEmail(emailExtractor.getUserFromHeader(authHeader)
                .getEmail()).orElseThrow(() -> new RuntimeException("Неверный Jwt")).getId(), idBook);
        return ResponseEntity.ok().build();
    }
}
