package ru.berezhnov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.berezhnov.models.UserWithCart;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserWithCart, String> {
    Optional<UserWithCart> findByEmail(String email);
}
