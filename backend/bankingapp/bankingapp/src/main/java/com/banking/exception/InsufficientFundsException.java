package com.banking.exception;

public class InsufficientFundsException extends AccountException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}