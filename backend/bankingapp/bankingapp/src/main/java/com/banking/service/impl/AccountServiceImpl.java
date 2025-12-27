package com.banking.service.impl;

import com.banking.dto.AccountDto;
import com.banking.entity.*;
import com.banking.exception.AccountException;
import com.banking.exception.InsufficientFundsException;
import com.banking.exception.ResourceNotFoundException;
import com.banking.mapper.AccountMapper;
import com.banking.repository.AccountRepository;
import com.banking.repository.RoleRepository;
import com.banking.repository.UserRepository;
import com.banking.service.AccountNumberGenerator;
import com.banking.service.AccountService;
import com.banking.service.CustomerIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AccountNumberGenerator accountNumberGenerator;
    private final CustomerIdGenerator customerIdGenerator;

    // New injections
    private final UserRepository userRepository;
    private final RoleRepository roleRepository; // assumes Role entity with name like "ROLE_USER"
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AccountServiceImpl(AccountRepository accountRepository,
                              AccountNumberGenerator accountNumberGenerator,
                              CustomerIdGenerator customerIdGenerator,
                              UserRepository userRepository,
                              RoleRepository roleRepository,
                              PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.accountNumberGenerator = accountNumberGenerator;
        this.customerIdGenerator = customerIdGenerator;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AccountDto createAccount(AccountDto accountDto) {
        // 1) Build default password from name + birth year
        String name = accountDto.accountHolderName();
        String first3 = (name != null && name.length() >= 3)
                ? name.substring(0, 3).toUpperCase()
                : (name == null ? "USR" : name.toUpperCase());
        String year = (accountDto.dateOfBirth() != null)
                ? String.valueOf(accountDto.dateOfBirth().getYear())
                : "2000";
        String defaultRaw = first3 + year; // e.g., RAH2000

        User user = userRepository.findByEmail(accountDto.email()).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(accountDto.email());
            user.setPhoneNumber(accountDto.phoneNumber());
            user.setPassword(passwordEncoder.encode(defaultRaw));
            user.setPasswordChangeRequired(true);
            user.setEnabled(true);

            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new IllegalStateException("ROLE_USER not seeded"));
            user.getRoles().add(userRole);

            user = userRepository.save(user);
        } else {
            if (user.getPhoneNumber() == null && accountDto.phoneNumber() != null) {
                user.setPhoneNumber(accountDto.phoneNumber());
                userRepository.save(user);
            }
        }

        // 3) Map and initialize Account, then link to user
        Account account = AccountMapper.mapToAccount(accountDto);
        account.setAccountNumber(accountNumberGenerator.generateAccountNumber());
        account.setCustomerId(customerIdGenerator.generateCustomerId());
        account.setAccountOpenDate(LocalDate.now());
        account.setAccountStatus(AccountStatus.ACTIVE);

        if (account.getBalance() == null) {
            account.setBalance(BigDecimal.ZERO);
        }
        if (account.getLiquidBalance() == null) {
            account.setLiquidBalance(BigDecimal.ZERO);
        } else {
            if (user.getPhoneNumber() == null && accountDto.phoneNumber() != null) {
                user.setPhoneNumber(accountDto.phoneNumber());
                userRepository.save(user);
            } else if (user.getPhoneNumber() != null && accountDto.phoneNumber() != null
                    && !user.getPhoneNumber().equals(accountDto.phoneNumber())) {
                throw new IllegalStateException("Phone already linked to a different user");
            }
        }

        account.setUser(user);

        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account " + id + " not found"));
        return AccountMapper.mapToAccountDto(account);
    }

    @Override
    public AccountDto depositAmount(Long id, BigDecimal amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account " + id + " not found"));
        BigDecimal totalBalance = account.getBalance().add(amount);
        account.setBalance(totalBalance);
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto withDrawAmount(Long id, BigDecimal amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account " + id + " not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient balance");
        }
        BigDecimal totalBalance = account.getBalance().subtract(amount);
        account.setBalance(totalBalance);
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public List<AccountDto> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return accounts.stream()
                .map(AccountMapper::mapToAccountDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account " + id + " not found"));
        accountRepository.deleteById(id);
    }

    @Override
    public AccountDto liquidDeposit(Long id, BigDecimal amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account " + id + " not found"));

        if (account.getBalance().signum() <= 0) {
            throw new AccountException("Account must be positive");
        }
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient Balance");
        }

        account.setBalance(account.getBalance().subtract(amount));
        account.setLiquidBalance(account.getLiquidBalance().add(amount));
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public AccountDto liquidWithDraw(Long id, BigDecimal amount) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account " + id + " not found"));

        if (account.getBalance().signum() <= 0) {
            throw new AccountException("Account must be positive");
        }
        if (account.getLiquidBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient Balance");
        }

        account.setLiquidBalance(account.getLiquidBalance().subtract(amount));
        account.setBalance(account.getBalance().add(amount));
        Account savedAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountDto(savedAccount);
    }

    @Override
    public List<AccountDto> getMyAccounts(String email){
        return accountRepository.findByUserEmail(email).stream()
                .map(AccountMapper::mapToAccountDto).toList();
    }

    @Override
    public AccountDto getOwnedAccountById(Long id, String email){
        Account acc = accountRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new AccessDeniedException("Forbidden"));
        return AccountMapper.mapToAccountDto(acc);
    }

    @Override
    public AccountDto liquidDepositOwned(Long id, BigDecimal amount, String email){
        Account acc = accountRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new AccessDeniedException("Forbidden"));
        return liquidDeposit(acc.getId(), amount);
    }

    @Override
    public AccountDto liquidWithdrawOwned(Long id, BigDecimal amount, String email){
        Account acc = accountRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new AccessDeniedException("Forbidden"));
        return liquidWithDraw(acc.getId(), amount);
    }
}
