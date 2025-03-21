package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.AuthorDTO;
import ru.berezhnov.models.Author;
import ru.berezhnov.services.AuthorService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/author")
public class AuthorController {

    private final AuthorService authorService;
    private final ModelMapper modelMapper;

    @Autowired
    public AuthorController(AuthorService authorService, ModelMapper modelMapper) {
        this.authorService = authorService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<AuthorDTO>> fetchAuthors() {
        return ResponseEntity.ok(authorService.findAll().stream().map(this::convertToAuthorDTO).toList());
    }

    @PostMapping
    public ResponseEntity<?> addAuthor(@RequestBody AuthorDTO authorDTO) {
        authorDTO.setId(null);
        authorService.addAuthor(convertToAuthor(authorDTO));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editAuthor(@PathVariable UUID id, @RequestBody AuthorDTO authorDTO) {
        authorDTO.setId(id);
        authorService.updateAuthor(convertToAuthor(authorDTO));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAuthor(@PathVariable UUID id) {
        authorService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private AuthorDTO convertToAuthorDTO(Author author) {
        AuthorDTO authorDTO = modelMapper.map(author, AuthorDTO.class);
        authorDTO.setIdAdmin(author.getAdmin().getId());
        return authorDTO;
    }

    private Author convertToAuthor(AuthorDTO authorDTO) {
        return modelMapper.map(authorDTO, Author.class);
    }
}
