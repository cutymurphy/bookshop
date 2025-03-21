package ru.berezhnov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.berezhnov.models.UserWithCart;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserWithCart, UUID> {
    Optional<UserWithCart> findByEmail(String email);
}
