package com.library.librarysys.controller;

import com.library.librarysys.entity.Loan;
import com.library.librarysys.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/loan")
public class LoanController {
    private final LoanService loanService;

    @Autowired
    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping("/byid/reader")
    public List<Loan> getLoans(Long readerID) {
        return loanService.getLoans(readerID);
    }

    @GetMapping("/byid/copy")
    public List<Loan> getLoansByCopy(Long copyID) {
        return loanService.getLoansByCopyID(copyID);
    }

    @GetMapping("/add")
    public void addLoan(Long employeeID, Long copyID, Long readerID) {
        loanService.addLoan(employeeID, copyID, readerID);
    }

    @GetMapping("/delete")
    public void deleteLoan(Long loanID) {
        loanService.deleteLoanById(loanID);
    }

    @GetMapping("/update/date")
    public void updateLoanReturnDate(Long loanID) {
        loanService.updateLoanReturnDate(loanID);
    }

    @GetMapping("/update/status")
    public void updateLoanStatus(Long loanID, Loan.Status status) {
        loanService.updateLoanStatus(loanID, status);
    }
}
