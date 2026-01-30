package com.byterevo.apocalypse.dto;

import com.byterevo.apocalypse.model.User;

public class AuthResponse {
    private User user;

    public AuthResponse() {
    }

    public AuthResponse(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
