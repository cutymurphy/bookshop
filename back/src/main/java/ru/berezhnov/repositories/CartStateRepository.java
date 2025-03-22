package ru.berezhnov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.berezhnov.models.CartState;

import java.util.UUID;

@Repository
public interface CartStateRepository extends JpaRepository<CartState, UUID> {
}
