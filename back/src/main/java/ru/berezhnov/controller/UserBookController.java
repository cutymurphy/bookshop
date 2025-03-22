package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.BookCountRequest;
import ru.berezhnov.dto.UserBookDTO;
import ru.berezhnov.models.Book;
import ru.berezhnov.models.UserBook;
import ru.berezhnov.services.UserBookService;
import ru.berezhnov.util.EmailExtractor;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cartBook")
public class UserBookController {

    private final UserBookService userBookService;
    private final ModelMapper modelMapper;
    private final EmailExtractor emailExtractor;

    @Autowired
    public UserBookController(UserBookService userBookService, ModelMapper modelMapper, EmailExtractor emailExtractor) {
        this.userBookService = userBookService;
        this.modelMapper = modelMapper;
        this.emailExtractor = emailExtractor;
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
}
