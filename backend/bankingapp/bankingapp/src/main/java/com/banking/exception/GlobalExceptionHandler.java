// com.banking.exception.GlobalExceptionHandler
package com.banking.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleNotFound(ResourceNotFoundException ex, WebRequest req){
        var body = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                req.getDescription(false),
                "ACCOUNT_NOT_FOUND"
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<ErrorDetails> handleInsufficient(InsufficientFundsException ex, WebRequest req){
        var body = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                req.getDescription(false),
                "INSUFFICIENT_FUNDS"
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(AccountException.class)
    public ResponseEntity<ErrorDetails> handleAccountGeneric(AccountException ex, WebRequest req){
        var body = new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                req.getDescription(false),
                "ACCOUNT_ERROR"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDetails> handleValidation(MethodArgumentNotValidException ex, WebRequest req){
        String message = ex.getBindingResult().getFieldErrors()
                .stream().map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining("; "));
        var body = new ErrorDetails(
                LocalDateTime.now(),
                message,
                req.getDescription(false),
                "VALIDATION_FAILED"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleAny(Exception ex, WebRequest req){
        var body = new ErrorDetails(
                LocalDateTime.now(),
                "Unexpected error",
                req.getDescription(false),
                "INTERNAL_SERVER_ERROR"
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
