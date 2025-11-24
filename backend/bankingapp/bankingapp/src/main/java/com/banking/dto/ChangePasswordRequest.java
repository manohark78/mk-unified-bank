package com.banking.dto;

public record ChangePasswordRequest(
        String username,
        String oldPassword,
        String newPassword) {

}

