package com.banking.controller;

import com.banking.dto.TransactionDto;
import com.banking.dto.TransferRequest;
import com.banking.entity.Account;
import com.banking.exception.ResourceNotFoundException;
import com.banking.repository.AccountRepository;
import com.banking.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final AccountRepository accountRepository;

    @PostMapping
    public ResponseEntity<?> transfer(@RequestBody TransferRequest req, Authentication auth){

        Account from = accountRepository.findByAccountNumber(req.fromAccountNumber())
                .filter(a -> a.getUser().getEmail().equals(auth.getName()))
                .orElseThrow(() -> new AccessDeniedException("Forbidden: not your account"));

        Account to = accountRepository.findByAccountNumber(req.toAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));
        TransactionDto tx = transactionService.transfer(
                req.fromAccountNumber(), req.toAccountNumber(), req.amount(), req.description()
        );

        return ResponseEntity.ok(tx);
    }
}
