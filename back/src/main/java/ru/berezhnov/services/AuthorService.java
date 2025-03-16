package ru.berezhnov.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.dto.AuthorDTO;
import ru.berezhnov.models.Author;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.AuthorRepository;
import ru.berezhnov.repositories.UserRepository;
import ru.berezhnov.util.AppException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public List<AuthorDTO> getAll() {
        return authorRepository.findAll().stream().map(this::getAuthorDTO)
                .collect(Collectors.toList());
    }

    private AuthorDTO getAuthorDTO(Author author) {
        AuthorDTO authorDTO = modelMapper.map(author, AuthorDTO.class);
        authorDTO.setIdAdmin(author.getAdmin().getId());
        return authorDTO;
    }

    private Author getAuthor(AuthorDTO authorDTO) {
        return modelMapper.map(authorDTO, Author.class);
    }

    @Transactional
    public void addAuthor(AuthorDTO authorDTO) {
        Author author = modelMapper.map(authorDTO, Author.class);
        UserWithCart admin = userRepository.findById(authorDTO.getIdAdmin())
                .orElseThrow(() -> new AppException("Admin not found"));
        author.setAdmin(admin);
        authorRepository.save(author);
    }

    @Transactional
    public void updateAuthor(AuthorDTO authorDTO) {
        authorRepository.findById(authorDTO.getId()).orElseThrow(() -> new AppException("Author not found"));
        this.addAuthor(authorDTO);
    }

    @Transactional
    public void deleteById(String id) {
        Author authorToDelete = authorRepository.findById(id).orElseThrow(() -> new AppException("Author not found"));
        authorRepository.delete(authorToDelete);
    }
}
