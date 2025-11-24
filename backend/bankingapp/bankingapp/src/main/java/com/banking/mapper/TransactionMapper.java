package com.banking.mapper;

import com.banking.dto.TransactionDto;
import com.banking.entity.Transaction;

public class TransactionMapper {

    public static TransactionDto mapToDto(Transaction transaction) {
        if (transaction == null) return null;

        Long fromAccountId = null;
        Long toAccountId = null;
        String fromAccountNumber = null;
        String toAccountNumber = null;

        if (transaction.getFromAccount() != null) {
            fromAccountId = transaction.getFromAccount().getId();
            fromAccountNumber = transaction.getFromAccount().getAccountNumber();
        }

        if (transaction.getToAccount() != null) {
            toAccountId = transaction.getToAccount().getId();
            toAccountNumber = transaction.getToAccount().getAccountNumber();
        }

        return new TransactionDto(
                transaction.getId(),
                transaction.getTransactionType(),
                fromAccountId,
                toAccountId,
                fromAccountNumber,
                toAccountNumber,
                transaction.getAmount(),
                transaction.getTransactionDate(),
                transaction.getDescription(),
                transaction.getStatus()
        );
    }
}
