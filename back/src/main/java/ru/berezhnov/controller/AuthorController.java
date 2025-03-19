package ru.berezhnov.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.AuthorDTO;
import ru.berezhnov.services.AuthorService;

import java.util.List;

@RestController
@RequestMapping("/api/author")
public class AuthorController {

    private final AuthorService authorService;

    @Autowired
    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<List<AuthorDTO>> fetchAuthors() {
        return ResponseEntity.ok(authorService.getAll());
    }

    @PostMapping
    public ResponseEntity<?> addAuthor(@RequestBody AuthorDTO authorDTO) {
        authorDTO.setId(null);
        authorService.addAuthor(authorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editAuthor(@PathVariable String id, @RequestBody AuthorDTO authorDTO) {
        authorDTO.setId(id);
        authorService.updateAuthor(authorDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAuthor(@PathVariable String id) {
        authorService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
