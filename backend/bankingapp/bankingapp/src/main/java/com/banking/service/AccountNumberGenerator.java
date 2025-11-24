package com.banking.service;


import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
public class AccountNumberGenerator {
    public String generateAccountNumber(){
        long random = ThreadLocalRandom.current().nextLong(10000000000000L, 100000000000000L);
        return "7" + random;
    }
}


