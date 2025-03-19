package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.BookAndAuthorResponse;
import ru.berezhnov.dto.BookCountRequest;
import ru.berezhnov.dto.BookDTO;
import ru.berezhnov.models.Book;
import ru.berezhnov.services.BookService;

import java.util.List;

@RestController
@RequestMapping("/api/book")
public class BookController {

    private final BookService bookService;
    private final ModelMapper modelMapper;

    @Autowired
    public BookController(BookService bookService, ModelMapper modelMapper) {
        this.bookService = bookService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<BookAndAuthorResponse>> loadBooksAndAuthors() {
       return ResponseEntity.ok(bookService.findAll().stream().map(this::getBookAndAuthorResponse).toList());
    }

    private BookAndAuthorResponse getBookAndAuthorResponse(Book book) {
        BookAndAuthorResponse bookAndAuthorResponse = modelMapper.map(book, BookAndAuthorResponse.class);
        bookAndAuthorResponse.setAuthor(new BookAndAuthorResponse.AuthorResponse());
        bookAndAuthorResponse.getAuthor().setName(book.getAuthor().getName());
        return bookAndAuthorResponse;
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