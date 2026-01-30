package com.byterevo.apocalypse.service;

import com.byterevo.apocalypse.entity.Token;
import com.byterevo.apocalypse.entity.User;
import com.byterevo.apocalypse.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private TokenRepository tokenRepository;

    public String createToken(User user) {
        String tokenValue = UUID.randomUUID().toString();
        Token token = new Token(tokenValue, user);
        tokenRepository.save(token);
        return tokenValue;
    }

    public Optional<User> getUserByToken(String tokenValue) {
        return tokenRepository.findByToken(tokenValue)
                .map(Token::getUser);
    }

    @Transactional
    public void deleteToken(String tokenValue) {
        tokenRepository.deleteByToken(tokenValue);
    }

    public boolean isAdmin(String tokenValue) {
        return getUserByToken(tokenValue)
                .map(User::getIsSuperuser)
                .orElse(false);
    }
}
