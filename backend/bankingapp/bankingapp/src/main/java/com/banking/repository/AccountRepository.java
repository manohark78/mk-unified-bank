package com.banking.repository;

import com.banking.entity.Account;
import com.banking.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUserEmail(String email);
    Optional<Account> findByIdAndUserEmail(Long id, String email);
    Optional<Account> findByAccountNumber(String accountNumber);


}

