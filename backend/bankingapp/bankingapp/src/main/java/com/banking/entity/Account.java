package com.banking.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name="account_number", nullable = false, unique = true, length = 15)
    private String accountNumber;

    @Column(name="customer_id", nullable = false, unique = true, length = 12)
    private String customerId;

    @Column(name="account_holder_name", nullable=false)
    private String accountHolderName;

    @Column(name="phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name="account_type", nullable = false)
    private AccountType accountType;

    @Column(name = "address_line")
    private String addressLine;

    @Column(name = "city")
    private String city;

    @Column(name = "state_name")
    private String stateName;

    @Column(name = "pincode", length = 10)
    private String pincode;

    @Column(name = "country")
    private String country;

    @Column(name = "account_open_date", nullable = false)
    private LocalDate accountOpenDate;

    @Enumerated(EnumType.STRING)
    @Column(name="account_status", nullable = false)
    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private BigDecimal liquidBalance;

    @Column(name = "nominee_name")
    private String nomineeName;

    @Column(name = "nominee_relationship")
    private String nomineeRelationship;

    @Column(name = "nominee_phone", length = 15)
    private String nomineePhone;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;
}
