package com.banking.repository;

import com.banking.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByFromAccountIdOrToAccountId(Long fromAccountId, Long toAccountId);

    List<Transaction> findByFromAccountIdOrToAccountIdOrderByTransactionDateDesc(Long fromAccountId, Long toAccountId);

    Page<Transaction> findByFromAccountIdOrToAccountId(Long fromId, Long toId, Pageable p);
    Page<Transaction> findByFromAccountUserEmailOrToAccountUserEmail(String e1, String e2, Pageable p);
}
