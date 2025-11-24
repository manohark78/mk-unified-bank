package com.banking.dto;

import jakarta.validation.constraints.*;
import com.banking.entity.AccountStatus;
import com.banking.entity.AccountType;
import java.math.BigDecimal;
import java.time.LocalDate;

//@Data
//@AllArgsConstructor
//public class AccountDto {
//
//    private
//    private String accountHolderName;
//    private BigDecimal balance;
//}


public record AccountDto(
        Long id,

        String accountNumber,

        String customerId,

        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 100, message = "Name must be greater than 3 Characters ")
        String accountHolderName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Phone no. is required")
        @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$", message = "Invalid phone no.format")
        String phoneNumber,

        @NotNull(message = "Date of birth is required")
        LocalDate dateOfBirth,

        String addressLine,

        String city,

        String stateName,

        @Pattern(regexp = "^\\d{6}$", message = "pincode must be 6 digits")
        String pincode,

        String country,

        @NotNull(message = "Account type is required")
        AccountType accountType,

        AccountStatus accountStatus,

        LocalDate accountOpenDate,

        @NotNull(message = "Balance is required")
        @DecimalMin(value = "0.00", inclusive = true, message = "Balance cannot be negative")
        @Digits(integer = 15, fraction = 2, message = "Invalid balance input")
        BigDecimal balance,

        @NotNull(message = "Liquid balance is required")
        @DecimalMin(value = "0.00", inclusive = true, message = "Liquid balance cannot be negative")
        @Digits(integer = 15, fraction = 2, message = "Invalid liquid balance input")
        BigDecimal liquidBalance,

        String nomineeName,

        String nomineeRelationship,

        @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$", message = "Invalid nominee phone input")
        String nomineePhone
) {
}

