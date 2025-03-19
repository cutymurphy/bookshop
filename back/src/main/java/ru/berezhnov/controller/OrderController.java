package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.CartStateDTO;
import ru.berezhnov.dto.OrderInfo;
import ru.berezhnov.models.Order;
import ru.berezhnov.services.OrderService;
import ru.berezhnov.util.EmailExtractor;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;
    private final EmailExtractor emailExtractor;
    private final ModelMapper modelMapper;

    @Autowired
    public OrderController(OrderService orderService, EmailExtractor emailExtractor, ModelMapper modelMapper) {
        this.orderService = orderService;
        this.emailExtractor = emailExtractor;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<Order>> fetchOrders(@RequestParam(name = "deleted",
            required = false, defaultValue = "false") boolean deleted) {
        return ResponseEntity.ok(orderService.findAll(deleted));
    }

    @GetMapping("/load")
    public ResponseEntity<List<OrderInfo>> loadOrders(@RequestHeader(name = "Authorization") String authHeader) {
        return ResponseEntity.ok(orderService.loadOrders(emailExtractor.getUserFromHeader(authHeader))
                .stream().map(this::getOrderInfo).toList());
    }

    private OrderInfo getOrderInfo(Order order) {
        OrderInfo.OrderImportant orderImportant = modelMapper.map(order, OrderInfo.OrderImportant.class);
        OrderInfo.UserImportant userImportant = modelMapper.map(order.getUser(), OrderInfo.UserImportant.class);
        OrderInfo.AdminImportant adminImportant = null;
        if (order.getAdmin() != null) {
            adminImportant = modelMapper.map(order.getAdmin(), OrderInfo.AdminImportant.class);
        }
        List<CartStateDTO> cartStateDTOS = order.getCartStates().stream().map(cs -> {
            CartStateDTO cartStateDTO = modelMapper.map(cs, CartStateDTO.class);
            cartStateDTO.setBookInfo(cs.getBook().getId());
            return cartStateDTO;
        }).toList();
        return new OrderInfo(orderImportant, userImportant, adminImportant, cartStateDTOS);
    }
}
