    package com.banking.controller;

    import com.banking.dto.AccountDto;
    import com.banking.service.AccountService;
    import jakarta.validation.Valid;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.core.Authentication;
    import org.springframework.web.bind.annotation.*;

    import java.math.BigDecimal;
    import java.util.List;
    import java.util.Map;

    @CrossOrigin(origins = "http://localhost:5173")
    @RestController
    @RequestMapping("/api/accounts")
    public class AccountController {

        private AccountService accountService;

        @Autowired
        public AccountController(AccountService accountService){
            this.accountService=accountService;
        }

        @PostMapping
        public ResponseEntity<AccountDto> addAccount(@Valid @RequestBody AccountDto accountDto){
            return new ResponseEntity<>(accountService.createAccount(accountDto), HttpStatus.CREATED);
        }

        @GetMapping("/{id}")
        public ResponseEntity<AccountDto> getAccountById(@PathVariable Long id){
            AccountDto accountDto = accountService.getAccountById(id);
            return ResponseEntity.ok(accountDto);
        }

        @PutMapping("/{id}/deposit")
        public ResponseEntity<AccountDto> depositAmount(@PathVariable Long id,
                                                        @RequestBody  Map<String, BigDecimal> request){

            BigDecimal amount = request.get("amount");
            AccountDto accountDto = accountService.depositAmount(id, amount);
            return ResponseEntity.ok(accountDto);
        }

        @PutMapping("/{id}/withdraw")
        public ResponseEntity<AccountDto> withDrawAmount(@PathVariable Long id,
                                                         @RequestBody  Map<String, BigDecimal> request){

            BigDecimal amount = request.get("amount");
            AccountDto accountDto = accountService.withDrawAmount(id, amount);
            return ResponseEntity.ok(accountDto);
        }

        @GetMapping
        public ResponseEntity<List<AccountDto>> getALlAccounts(){
            List<AccountDto> accounts = accountService.getAllAccounts();
            return ResponseEntity.ok(accounts);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteAccountById(@PathVariable Long id){
            accountService.deleteAccountById(id);
            return ResponseEntity.ok("Account is deleted successfully");
        }

        @PutMapping("/{id}/liquid/deposit")
        public ResponseEntity<AccountDto> liquidDeposit(@PathVariable Long id,
                                                        @RequestBody Map<String, BigDecimal> request) {
            BigDecimal amount = request.get("amount");
            return ResponseEntity.ok(accountService.liquidDeposit(id, amount));
        }

        @PutMapping("/{id}/liquid/withdraw")
        public ResponseEntity<AccountDto> liquidWithDraw(@PathVariable Long id,
                                                         @RequestBody Map<String, BigDecimal> request) {
            BigDecimal amount = request.get("amount");
            return ResponseEntity.ok(accountService.liquidWithDraw(id, amount));
        }

        @GetMapping("/my")
        public ResponseEntity<List<AccountDto>> myAccounts(Authentication auth){
            return ResponseEntity.ok(accountService.getMyAccounts(auth.getName()));
        }

        @GetMapping("/owned/{id}")
        public ResponseEntity<AccountDto> getOwnedAccountById(@PathVariable Long id, Authentication auth){
            return ResponseEntity.ok(accountService.getOwnedAccountById(id, auth.getName()));
        }

        @PutMapping("/owned/{id}/liquid/deposit")
        public ResponseEntity<AccountDto> liquidDepositOwned(@PathVariable Long id,
                                                             @RequestBody Map<String, BigDecimal> request,
                                                             Authentication auth){
            BigDecimal amount = request.get("amount");
            return ResponseEntity.ok(accountService.liquidDepositOwned(id, amount, auth.getName()));
        }

        @PutMapping("/owned/{id}/liquid/withdraw")
        public ResponseEntity<AccountDto> liquidWithdrawOwned(@PathVariable Long id,
                                                              @RequestBody Map<String, BigDecimal> request,
                                                              Authentication auth){
            BigDecimal amount = request.get("amount");
            return ResponseEntity.ok(accountService.liquidWithdrawOwned(id, amount, auth.getName()));
        }
    }
