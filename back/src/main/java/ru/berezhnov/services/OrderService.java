package ru.berezhnov.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.berezhnov.dto.UserEmail;
import ru.berezhnov.models.Order;
import ru.berezhnov.repositories.OrderRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class OrderService {

    public final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> findAll(boolean deleted) {
        if (deleted) return orderRepository.findAllDeleted();
        return orderRepository.findAllUndeleted();
    }

    public List<Order> loadOrders(UserEmail userEmail) {
        return orderRepository.findAllByUserEmail(userEmail.getEmail());
    }
}
