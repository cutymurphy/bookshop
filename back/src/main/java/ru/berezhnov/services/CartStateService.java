package ru.berezhnov.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.models.CartState;
import ru.berezhnov.repositories.CartStateRepository;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CartStateService {

    private final CartStateRepository cartStateRepository;

    @Autowired
    public CartStateService(CartStateRepository cartStateRepository) {
        this.cartStateRepository = cartStateRepository;
    }

    public List<CartState> findAll() {
        return cartStateRepository.findAll();
    }

    @Transactional
    public void deleteOrder(UUID id) {
        CartState cartState = cartStateRepository.findById(id).orElseThrow(()
                -> new RuntimeException("Состояние корзины не найдено"));
        cartStateRepository.delete(cartState);
    }
}
