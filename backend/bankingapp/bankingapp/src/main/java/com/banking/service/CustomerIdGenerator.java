package com.banking.service;

import com.banking.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Year;

@Service
@RequiredArgsConstructor
public class CustomerIdGenerator {

    private final AccountRepository accountRepository;

    public String generateCustomerId() {
        int currentYear = Year.now().getValue();
        long count = accountRepository.count() + 1;
        String sequence = String.format("%04d", count);
        return "CUST" + currentYear + sequence;
    }
}
