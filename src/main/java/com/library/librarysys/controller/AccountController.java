package com.library.librarysys.controller;

import com.library.librarysys.entity.Account;
import com.library.librarysys.entity.users.LoggedUser;
import com.library.librarysys.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import java.util.List;


@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/byemail")
    public List<Account> getByEmail(String email) {
        return accountService.getByEmail(email);
    }

    @GetMapping("/byid")
    public List<Account> getAccount(Long accountID) {
        return accountService.getByID(accountID);
    }

    @GetMapping("/add")
    public ResponseEntity<Account> addAccount(String email, String password) {
        Account account = accountService.addAccount(email, password);
        if (account != null) {
            return ResponseEntity.ok(account);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/delete")
    public void deleteAccount(Long accountID) {
        accountService.deleteAccountById(accountID);
    }

    @GetMapping("/update/email")
    public void updateAccountEmail(Long accountID, String email) {
        accountService.updateAccountEmail(accountID, email);
    }

    @GetMapping("/update/password/byid")
    public void updateAccountPassword(Long accountID, String password) {
        accountService.updateAccountPassword(accountID, password);
    }

    @GetMapping("/update/password/byemail")
    public void updateAccountPassword(String email, String password) {
        accountService.updateAccountPassword(email, password);
    }

    @GetMapping("/login")
    public LoggedUser logIn(String email, String password) {
        return accountService.logIn(email, password);
    }
}
