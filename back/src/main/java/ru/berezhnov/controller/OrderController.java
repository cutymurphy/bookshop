package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.BookDTO;
import ru.berezhnov.dto.OrderDTO;
import ru.berezhnov.dto.OrderInfoResponse;
import ru.berezhnov.models.Book;
import ru.berezhnov.models.Order;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.services.OrderService;
import ru.berezhnov.util.EmailExtractor;

import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<List<OrderInfoResponse>> loadOrders(@RequestHeader(name = "Authorization")
                                                                  String authHeader) {
        return ResponseEntity.ok(orderService.loadOrders(emailExtractor.getUserFromHeader(authHeader))
                .stream().map(this::convertToOrderInfoResponse).toList());
    }

    private OrderInfoResponse convertToOrderInfoResponse(Order order) {
        OrderInfoResponse.OrderImportant orderImportant = modelMapper.map(order,
                OrderInfoResponse.OrderImportant.class);
        OrderInfoResponse.UserImportant userImportant = modelMapper.map(order.getUser(),
                OrderInfoResponse.UserImportant.class);
        OrderInfoResponse.AdminImportant adminImportant = null;
        if (order.getAdmin() != null) {
            adminImportant = modelMapper.map(order.getAdmin(), OrderInfoResponse.AdminImportant.class);
        }
        List<OrderInfoResponse.CartStateInfo> cartStateInfos = order.getCartStates().stream().map(cs -> {
            OrderInfoResponse.CartStateInfo cartStateInfo = modelMapper.map(cs, OrderInfoResponse.CartStateInfo.class);
            cartStateInfo.setBookInfo(cs.getBook().getId());
            return cartStateInfo;
        }).toList();
        return new OrderInfoResponse(orderImportant, userImportant, adminImportant, cartStateInfos);
    }

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        orderDTO.setIdAdmin(order.getAdmin().getId());
        orderDTO.setIdUser(order.getUser().getId());
        return orderDTO;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editOrder(@RequestBody OrderDTO orderDTO) {//+
        orderService.editOrder(convertToOrder(orderDTO));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable UUID id) {//+
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }

    private Order convertToOrder(OrderDTO orderDTO) {
        Order order = modelMapper.map(orderDTO, Order.class);
        order.setAdmin(new UserWithCart(orderDTO.getIdAdmin()));
        return order;
    }

    @PostMapping
    public ResponseEntity<?> addOrder(@RequestBody OrderDTO orderDTO,
                                      @RequestHeader(name = "Authorization") String authHeader) {//+
        orderService.addOrder(emailExtractor.getUserFromHeader(authHeader).getEmail(), convertToOrder(orderDTO));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{idOrder}")
    public ResponseEntity<List<BookDTO>> getCartStateBooksById(@PathVariable UUID idOrder) {//+
        return ResponseEntity.ok(orderService.getCartStateBooksById(idOrder).stream().map(this::convertToBookDTO)
                .toList());
    }

    private BookDTO convertToBookDTO(Book book) {
        BookDTO bookDTO = modelMapper.map(book, BookDTO.class);
        bookDTO.setIdAuthor(book.getAuthor().getId());
        bookDTO.setIdAdmin(book.getAdmin().getId());
        return bookDTO;
    }
}
