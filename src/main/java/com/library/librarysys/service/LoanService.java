package com.library.librarysys.service;

import com.library.librarysys.entity.Loan;
import com.library.librarysys.entity.Order;
import com.library.librarysys.repository.LoanRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class LoanService {

   private final LoanRepository loanRepository;

    @Autowired
    public LoanService(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public List<Loan> getLoans(Long readerID) {
        try {
            if (readerID == null) {
                throw new IllegalArgumentException("Niepoprawny readerID");
            }
            return loanRepository.findLoansByReaderId(readerID);
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania wypożyczeń: " + e.getMessage());
            throw e;
        }
    }

    public List<Loan> getLoansByCopyID(Long copyID) {
        try {
            if (copyID == null) {
                throw new IllegalArgumentException("Niepoprawny copyID");
            }
            if(loanRepository.findLoansByCopyId(copyID) != null) {
                return loanRepository.findLoansByCopyId(copyID);
            } else {
                return null;
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania wypożyczeń: " + e.getMessage());
            throw e;
        }
    }

    public void addLoan(Long employeeID, Long copyID, Long readerID) {
        try {
            if (readerID == null || copyID == null || employeeID == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }
            Loan loan = new Loan(employeeID, copyID, readerID);
            loanRepository.save(loan);
            System.out.println("Wypożyczenie utworzone");
        } catch (Exception e) {
            System.err.println("Błąd podczas tworzenia wypożyczenia: " + e.getMessage());
            throw e;
        }
    }

    public void deleteLoanById(Long loanID) {
        try {
            if (loanID == null) {
                throw new IllegalArgumentException("Nieprawidłowy loanID.");
            }
            loanRepository.deleteById(loanID);
            System.out.println("Wypożyczenie usunięte z bazy danych");
        } catch (Exception e) {
            System.err.println("Błąd podczas usuwania wypożyczenia: " + e.getMessage());
            throw e;
        }
    }

    public void updateLoanReturnDate(Long loanID) {
        try {
            if (loanID == null) {
                throw new IllegalArgumentException("Nieprawidłowy loanID lub data zwrotu.");
            }
            Loan loan = loanRepository.findById(loanID)
                    .orElseThrow(() -> new EntityNotFoundException("Wypożyczenie o id " + loanID + " nie znalezione."));
            loan.setReturnDate(loan.getReturnDate().plusDays(30));
            loanRepository.save(loan);
            System.out.println("Data końca wypożyczenia została zmieniona.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania daty zwrotu: " + e.getMessage());
            throw e;
        }
    }

    public void updateLoanStatus(Long loanID, Loan.Status status) {
        try {
            if (loanID == null || status == null) {
                throw new IllegalArgumentException("Nieprawidłowy loanID lub status.");
            }
            Loan loan = loanRepository.findById(loanID)
                    .orElseThrow(() -> new EntityNotFoundException("Wypożyczenie o id " + loanID + " nie znalezione."));
            loan.setStatus(status);
            loanRepository.save(loan);
            System.out.println("Status wypożyczenia został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania statusu wypożyczenia: " + e.getMessage());
            throw e;
        }
    }
}