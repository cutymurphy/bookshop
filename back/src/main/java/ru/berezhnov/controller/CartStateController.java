package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.CartStateDTO;
import ru.berezhnov.models.CartState;
import ru.berezhnov.services.CartStateService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cartState")
public class CartStateController {

    private final CartStateService cartStateService;
    private final ModelMapper modelMapper;

    public CartStateController(CartStateService cartStateService, ModelMapper modelMapper) {
        this.cartStateService = cartStateService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<CartStateDTO>> fetchCartStates() {//+
        return ResponseEntity.ok(cartStateService.findAll().stream().map(this::convertToCartStateDTO).toList());
    }

    private CartStateDTO convertToCartStateDTO(CartState cartState) {
        CartStateDTO cartStateDTO = modelMapper.map(cartState, CartStateDTO.class);
        cartStateDTO.setBookId(cartState.getBook().getId());
        cartStateDTO.setOrderId(cartState.getOrder().getId());
        return cartStateDTO;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartState(@PathVariable UUID id) {//+
        cartStateService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }

}
