package ru.berezhnov.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.dto.UserEmail;
import ru.berezhnov.models.Order;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.OrderRepository;
import ru.berezhnov.repositories.UserRepository;
import ru.berezhnov.util.AppException;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class OrderService {

    public final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public List<Order> findAll(boolean deleted) {
        if (deleted) return orderRepository.findAllDeleted();
        return orderRepository.findAllUndeleted();
    }

    public List<Order> loadOrders(UserEmail userEmail) {
        return orderRepository.findAllByUserEmail(userEmail.getEmail());
    }

    @Transactional
    public void editOrder(Order order) {
        Order persistedOrder = orderRepository.findById(order.getId()).orElseThrow(()
                -> new AppException("Заказ не найден"));
        UserWithCart admin = userRepository.findById(order.getAdmin().getId()).orElseThrow(()
                -> new AppException("Администратор не найден"));
        persistedOrder.setAdmin(admin);
        persistedOrder.setDateModified(new Date());
        persistedOrder.setStatus(order.getStatus());
        persistedOrder.setMessage(order.getMessage());
    }

    @Transactional
    public void deleteOrder(UUID id) {
        Order order = orderRepository.findById(id).orElseThrow(()
                -> new AppException("Заказ не найден"));
        orderRepository.delete(order);
    }
}
