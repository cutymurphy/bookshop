package ru.berezhnov.services;

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
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    @Autowired
    public AuthorService(AuthorRepository authorRepository, ModelMapper modelMapper, UserRepository userRepository) {
        this.authorRepository = authorRepository;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
    }

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
                .orElseThrow(() -> new AppException("Администратор не найден"));
        author.setAdmin(admin);
        authorRepository.save(author);
    }

    @Transactional
    public void updateAuthor(AuthorDTO authorDTO) {
        authorRepository.findById(authorDTO.getId()).orElseThrow(() -> new AppException("Автор не найден"));
        this.addAuthor(authorDTO);
    }

    @Transactional
    public void deleteById(String id) {
        Author authorToDelete = authorRepository.findById(id).orElseThrow(() -> new AppException("Автор не найден"));
        authorRepository.delete(authorToDelete);
    }
}
