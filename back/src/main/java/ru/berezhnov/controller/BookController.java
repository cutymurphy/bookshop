package ru.berezhnov.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.BookCountRequest;
import ru.berezhnov.dto.BookDTO;
import ru.berezhnov.services.BookService;

import java.util.List;

@RestController
@RequestMapping("/api/book")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<BookDTO>> fetchBooks() {
       return ResponseEntity.ok(bookService.getAll());
    }

    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody BookDTO bookDTO) {
        bookDTO.setId(null);
        bookService.addBook(bookDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editBook(@PathVariable String id, @RequestBody BookDTO bookDTO) {
        bookDTO.setId(id);
        bookService.updateBook(bookDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/bookCount/{idBook}")
    public ResponseEntity<?> updateBookCount(@PathVariable String idBook,
                                             @RequestBody BookCountRequest bookCountRequest) {
        bookService.updateBookCount(idBook, bookCountRequest.getBookCount());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable String id) {
        bookService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}