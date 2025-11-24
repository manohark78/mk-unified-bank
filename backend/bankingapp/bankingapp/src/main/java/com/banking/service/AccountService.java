package com.banking.service;

import com.banking.dto.AccountDto;

import java.math.BigDecimal;
import java.util.List;

public interface AccountService {

    AccountDto createAccount(AccountDto accountDto);

    AccountDto getAccountById(Long id);

    AccountDto depositAmount(Long id, BigDecimal amount);

    AccountDto withDrawAmount(Long id, BigDecimal amount);

    List<AccountDto> getAllAccounts();

    void deleteAccountById(Long id);

    AccountDto liquidDeposit(Long id, BigDecimal amount);

    AccountDto liquidWithDraw(Long id, BigDecimal amount);

    List<AccountDto> getMyAccounts(String email);

    AccountDto getOwnedAccountById(Long id, String email);

    AccountDto liquidDepositOwned(Long id, BigDecimal amount, String email);

    AccountDto liquidWithdrawOwned(Long id, BigDecimal amount, String email);


}
