package com.banking.mapper;

import com.banking.dto.AccountDto;
import com.banking.entity.Account;

public class AccountMapper {

    public static Account mapToAccount(AccountDto accountDto) {
        if (accountDto == null) return null;

        Account account = new Account();
        if (accountDto.accountNumber() != null) {
            account.setAccountNumber(accountDto.accountNumber());
        }
        if (accountDto.customerId() != null) {
            account.setCustomerId(accountDto.customerId());
        }

        account.setAccountHolderName(accountDto.accountHolderName());
        account.setPhoneNumber(accountDto.phoneNumber());
        account.setEmail(accountDto.email());
        account.setDateOfBirth(accountDto.dateOfBirth());
        account.setAddressLine(accountDto.addressLine());
        account.setCity(accountDto.city());
        account.setStateName(accountDto.stateName());
        account.setPincode(accountDto.pincode());
        account.setCountry(accountDto.country());
        account.setAccountType(accountDto.accountType());

        if (accountDto.accountStatus() != null) {
            account.setAccountStatus(accountDto.accountStatus());
        }
        if (accountDto.accountOpenDate() != null) {
            account.setAccountOpenDate(accountDto.accountOpenDate());
        }

        account.setBalance(accountDto.balance());
        account.setLiquidBalance(accountDto.liquidBalance());
        account.setNomineeName(accountDto.nomineeName());
        account.setNomineeRelationship(accountDto.nomineeRelationship());
        account.setNomineePhone(accountDto.nomineePhone());

        return account;
    }


    public static AccountDto mapToAccountDto(Account account) {
        if (account == null) return null;

        AccountDto accountDto = new AccountDto(
                account.getId(),
                account.getAccountNumber(),
                account.getCustomerId(),
                account.getAccountHolderName(),
                account.getPhoneNumber(),
                account.getEmail(),
                account.getDateOfBirth(),
                account.getAddressLine(),
                account.getCity(),
                account.getStateName(),
                account.getPincode(),
                account.getCountry(),
                account.getAccountType(),
                account.getAccountStatus(),
                account.getAccountOpenDate(),
                account.getBalance(),
                account.getLiquidBalance(),
                account.getNomineeName(),
                account.getNomineeRelationship(),
                account.getNomineePhone()
        );
        return accountDto;
    }
}
