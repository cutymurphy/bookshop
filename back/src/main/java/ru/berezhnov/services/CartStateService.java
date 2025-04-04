package ru.berezhnov.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.models.Book;
import ru.berezhnov.models.CartState;
import ru.berezhnov.models.Order;
import ru.berezhnov.repositories.BookRepository;
import ru.berezhnov.repositories.CartStateRepository;
import ru.berezhnov.repositories.OrderRepository;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class CartStateService {

    private final CartStateRepository cartStateRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public CartStateService(CartStateRepository cartStateRepository, BookRepository bookRepository, OrderRepository orderRepository) {
        this.cartStateRepository = cartStateRepository;
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
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

    @Transactional
    public void addCartState(CartState cartState) {
        Book book = bookRepository.findById(cartState.getBook().getId()).orElseThrow(() -> new RuntimeException(
                "Книга не найдена"));
        cartState.setBook(book);
        Order order = orderRepository.findById(cartState.getOrder().getId()).orElseThrow(() -> new RuntimeException(
                "Заказ не найден"));
        cartState.setOrder(order);
        cartStateRepository.save(cartState);
    }
}
