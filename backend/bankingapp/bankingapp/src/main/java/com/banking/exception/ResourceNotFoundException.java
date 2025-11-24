package com.banking.exception;

public class ResourceNotFoundException extends AccountException {
    public ResourceNotFoundException(String message) { super(message); }
}