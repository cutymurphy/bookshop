package ru.berezhnov.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.berezhnov.dto.*;
import ru.berezhnov.models.UserBook;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.services.AuthenticationService;
import ru.berezhnov.services.UserService;
import ru.berezhnov.util.AppException;
import ru.berezhnov.util.EmailExtractor;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    private final AuthenticationService authenticationService;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final EmailExtractor emailExtractor;

    @Autowired
    public UserController(AuthenticationService authenticationService, ModelMapper modelMapper,
                          UserService userService, EmailExtractor emailExtractor) {
        this.authenticationService = authenticationService;
        this.modelMapper = modelMapper;
        this.userService = userService;
        this.emailExtractor = emailExtractor;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {//+ addUser()
        return ResponseEntity.ok(authenticationService.register(modelMapper.map(request, UserWithCart.class)));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody UserDTO user) {
        user.setId(id);
        userService.update(convertToUser(user));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> fetchUsers() {
        return ResponseEntity.ok(userService.findAll().stream().map(this::convertToUserDTO).toList());
    }

    @GetMapping("/user/load")
    public ResponseEntity<UserCartResponse> loadUserAndCart(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(convertToUserCartResponse(userService.findByEmail(emailExtractor.getUserFromHeader(authHeader)
                        .getEmail()).orElseThrow(() -> new AppException("Пользователь не найден"))));
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUser(@RequestHeader("Authorization") String authHeader) {//+ getUserByEmail()
        return ResponseEntity.ok(convertToUserDTO(userService.findByEmail(emailExtractor.getUserFromHeader(authHeader)
                .getEmail()).orElseThrow(() -> new AppException("Пользователь не найден"))));
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {//+
        userService.delete(id);
        return ResponseEntity.ok().build();
    }

    private UserCartResponse convertToUserCartResponse(UserWithCart user) {
        UserCartResponse userCartResponse = modelMapper.map(user, UserCartResponse.class);
        userCartResponse.setCartBooks(user.getUserBooks().stream().map(UserBook::getBook)
                .map(b -> modelMapper.map(b, BookDTO.class)).toList());
        return userCartResponse;
    }

    private UserDTO convertToUserDTO(UserWithCart user) {
        return modelMapper.map(user, UserDTO.class);
    }

    private UserWithCart convertToUser(UserDTO userDTO) {
        return modelMapper.map(userDTO, UserWithCart.class);
    }
}
