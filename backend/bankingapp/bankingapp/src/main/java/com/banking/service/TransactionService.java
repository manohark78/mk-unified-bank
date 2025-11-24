package com.banking.service;

import com.banking.dto.TransactionDto;
import com.banking.entity.Account;
import com.banking.entity.Transaction;
import com.banking.entity.TransactionStatus;
import com.banking.entity.TransactionType;
import com.banking.exception.InsufficientFundsException;
import com.banking.exception.ResourceNotFoundException;
import com.banking.mapper.TransactionMapper;
import com.banking.repository.AccountRepository;
import com.banking.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public TransactionDto transfer(String fromAccNo, String toAccNo, BigDecimal amount, String description) {
        if (fromAccNo == null || toAccNo == null || fromAccNo.isBlank() || toAccNo.isBlank()) {
            throw new IllegalArgumentException("Account numbers are required");
        }
        if (fromAccNo.equals(toAccNo)) {
            throw new IllegalArgumentException("Cannot transfer to same account");
        }
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        Account from = (Account) accountRepository.findByAccountNumber(fromAccNo)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));

        Account to = (Account) accountRepository.findByAccountNumber(toAccNo)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient balance");
        }

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
        accountRepository.save(from);
        accountRepository.save(to);

        Transaction tx = new Transaction();
        tx.setTransactionType(TransactionType.TRANSFER);
        tx.setFromAccount(from);
        tx.setToAccount(to);
        tx.setAmount(amount);
        tx.setTransactionDate(LocalDateTime.now());
        tx.setDescription(description);
        tx.setStatus(TransactionStatus.SUCCESS);

        Transaction saved = transactionRepository.save(tx);
        return TransactionMapper.mapToDto(saved);
    }

}
