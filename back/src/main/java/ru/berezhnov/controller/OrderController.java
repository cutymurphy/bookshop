package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.CartStateDTO;
import ru.berezhnov.dto.OrderDTO;
import ru.berezhnov.dto.OrderInfoResponse;
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
    public ResponseEntity<List<OrderDTO>> fetchOrders(@RequestParam(name = "deleted",
            required = false, defaultValue = "false") boolean deleted) {
        return ResponseEntity.ok(orderService.findAll(deleted).stream().map(this::convertToOrderDTO).toList());
    }

    @GetMapping("/load")
    public ResponseEntity<List<OrderInfoResponse>> loadOrders(@RequestHeader(name = "Authorization") String authHeader) {
        return ResponseEntity.ok(orderService.loadOrders(emailExtractor.getUserFromHeader(authHeader))
                .stream().map(this::convertToOrderInfoResponse).toList());
    }

    private OrderInfoResponse convertToOrderInfoResponse(Order order) {
        OrderInfoResponse.OrderImportant orderImportant = modelMapper.map(order, OrderInfoResponse.OrderImportant.class);
        OrderInfoResponse.UserImportant userImportant = modelMapper.map(order.getUser(), OrderInfoResponse.UserImportant.class);
        OrderInfoResponse.AdminImportant adminImportant = null;
        if (order.getAdmin() != null) {
            adminImportant = modelMapper.map(order.getAdmin(), OrderInfoResponse.AdminImportant.class);
        }
        List<CartStateDTO> cartStateDTOS = order.getCartStates().stream().map(cs -> {
            CartStateDTO cartStateDTO = modelMapper.map(cs, CartStateDTO.class);
            cartStateDTO.setBookInfo(cs.getBook().getId());
            return cartStateDTO;
        }).toList();
        return new OrderInfoResponse(orderImportant, userImportant, adminImportant, cartStateDTOS);
    }

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        orderDTO.setIdAdmin(order.getAdmin().getId());
        orderDTO.setIdUser(order.getUser().getId());
        return orderDTO;
    }
}
