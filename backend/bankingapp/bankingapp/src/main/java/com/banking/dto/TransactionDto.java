package com.banking.dto;

import com.banking.entity.TransactionStatus;
import com.banking.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionDto(
        Long id,
        TransactionType transactionType,
        Long fromAccountId,
        Long toAccountId,
        String fromAccountNumber,
        String toAccountNumber,
        BigDecimal amount,
        LocalDateTime transactionDate,
        String description,
        TransactionStatus transactionStatus
) {
}
