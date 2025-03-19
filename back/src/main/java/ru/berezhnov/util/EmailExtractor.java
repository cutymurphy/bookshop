package ru.berezhnov.util;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.berezhnov.config.JwtService;
import ru.berezhnov.dto.UserEmail;
import ru.berezhnov.services.UserService;

@Component
public class EmailExtractor {

    private final UserService userService;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;

    @Autowired
    public EmailExtractor(UserService userService, JwtService jwtService, ModelMapper modelMapper) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.modelMapper = modelMapper;
    }

    public UserEmail getUserFromHeader(String authHeader) {
        return modelMapper.map(userService.findByEmail(jwtService
                                .extractUsername(authHeader.substring("Bearer ".length())))
                        .orElseThrow(() -> new AppException("Could not found user from header")),
                UserEmail.class);
    }
}