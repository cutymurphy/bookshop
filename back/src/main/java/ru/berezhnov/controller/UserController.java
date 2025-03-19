package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.AuthenticationRequest;
import ru.berezhnov.dto.AuthenticationResponse;
import ru.berezhnov.dto.RegisterRequest;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.services.AuthenticationService;
import ru.berezhnov.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final AuthenticationService authenticationService;
    private final ModelMapper modelMapper;
    private final UserService userService;

    @Autowired
    public UserController(AuthenticationService authenticationService, ModelMapper modelMapper, UserService userService) {
        this.authenticationService = authenticationService;
        this.modelMapper = modelMapper;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(modelMapper.map(request, UserWithCart.class)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody UserWithCart user) {
        return null;
    }

    @GetMapping
    public ResponseEntity<List<UserWithCart>> fetchUsers() {
        return ResponseEntity.ok(userService.findAll());
    }
}
