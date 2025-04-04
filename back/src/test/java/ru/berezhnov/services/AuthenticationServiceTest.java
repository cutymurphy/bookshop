package ru.berezhnov.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.berezhnov.config.JwtService;
import ru.berezhnov.dto.AuthenticationRequest;
import ru.berezhnov.dto.AuthenticationResponse;
import ru.berezhnov.models.UserWithCart;
import ru.berezhnov.repositories.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_ShouldEncodePassword_SaveUser_AndReturnJwtToken() {
        UserWithCart user = new UserWithCart();
        user.setEmail("test@example.com");
        user.setPassword("plainPassword");
        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");
        when(jwtService.generateToken(any(UserWithCart.class))).thenReturn("jwt-token");
        AuthenticationResponse response = authenticationService.register(user);
        assertEquals("jwt-token", response.getToken());
        verify(userRepository, times(1)).save(argThat(savedUser ->
                savedUser.getPassword().equals("encodedPassword") &&
                        !savedUser.isAdmin() &&
                        savedUser.getEmail().equals("test@example.com")
        ));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        UserWithCart user = new UserWithCart();
        user.setEmail("test@example.com");
        user.setPassword("password");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new UserWithCart()));
        assertThrows(RuntimeException.class, () -> authenticationService.register(user));
    }

    @Test
    void register_ShouldThrowException_WhenEmailIsNull() {
        UserWithCart user = new UserWithCart();
        user.setEmail(null);
        user.setPassword("pass");
        assertThrows(RuntimeException.class, () -> authenticationService.register(user));
    }

    @Test
    void register_ShouldNotSaveUserWithPlainPassword() {
        UserWithCart user = new UserWithCart();
        user.setEmail("mail@test.com");
        user.setPassword("123");
        when(passwordEncoder.encode("123")).thenReturn("hashed123");
        when(jwtService.generateToken(any())).thenReturn("jwt");
        authenticationService.register(user);
        verify(userRepository).save(argThat(savedUser ->
                !savedUser.getPassword().equals("123") &&
                        savedUser.getPassword().equals("hashed123")
        ));
    }


    @Test
    void login_ShouldAuthenticateUser_AndReturnJwtToken() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        UserWithCart user = new UserWithCart();
        user.setEmail("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");
        AuthenticationResponse response = authenticationService.login(request);
        assertEquals("jwt-token", response.getToken());
        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("test@example.com", "password123")
        );
        verify(jwtService).generateToken(user);
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("password");
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> authenticationService.login(request));
    }

    @Test
    void login_ShouldThrowException_WhenPasswordIsInvalid() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");
        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager)
                .authenticate(any());
        assertThrows(BadCredentialsException.class, () -> authenticationService.login(request));
    }

    @Test
    void login_ShouldGenerateJwt_ForUserFromDatabase() {
        AuthenticationRequest request = new AuthenticationRequest();
        request.setEmail("test@example.com");
        request.setPassword("pass");
        UserWithCart dbUser = new UserWithCart();
        dbUser.setEmail("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(dbUser));
        when(jwtService.generateToken(dbUser)).thenReturn("jwt");
        authenticationService.login(request);
        verify(jwtService, times(1)).generateToken(dbUser);

    }
}
