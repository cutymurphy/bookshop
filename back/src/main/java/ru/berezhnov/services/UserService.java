package ru.berezhnov.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserWithCart> findAll() {
        return userRepository.findAll();
    }

    public Optional<UserWithCart> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public void update(UserWithCart userWithCart) {
        userRepository.findById(userWithCart.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.save(userWithCart);
    }

    @Transactional
    public void delete(UUID id) {
        userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(id);
    }
}
