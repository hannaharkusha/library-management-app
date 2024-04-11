package com.library.librarysys.service;

import com.library.librarysys.entity.Account;
import com.library.librarysys.entity.users.Administrator;
import com.library.librarysys.entity.users.LoggedUser;
import com.library.librarysys.repository.AccountRepository;
import com.library.password.PasswordEncoder;
import com.library.password.SaltGenerator;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
@Transactional
public class AccountService {
    private final AccountRepository accountRepository;
    private final EmployeeService employeeService;
    private final ReaderService readerService;

    @Autowired
    public AccountService(AccountRepository accountRepository, EmployeeService employeeService, ReaderService readerService) {
        this.accountRepository = accountRepository;
        this.employeeService = employeeService;
        this.readerService = readerService;
    }

    public List<Account> getByID(Long accountID) {
        return accountRepository.findAllById(Collections.singleton(accountID));
    }

    public List<Account> getByEmail(String email) {
        try {
            if (email == null) {
                throw new IllegalArgumentException("Niepoprawny adres email");
            }
            return accountRepository.findAccountByEmail(email);
        } catch (Exception e) {
            System.err.println("Błąd pobierania danych konta: " + e.getMessage());
            throw e;
        }
    }

    public Account addAccount(String email, String password) {
        try {
            if (email == null || password == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }
            if (passVerification(password)) {
                if (emailVerification(email) && isEmailUnique(email)) {
                    String salt = SaltGenerator.generateSalt();
                    String hashedPassword = PasswordEncoder.hashPassword(password, salt);
                    Account account = new Account(email, hashedPassword, salt);
                    accountRepository.save(account);
                    System.out.println("Konto dodane");
                    return account;
                } else {
                    System.out.println("Konto jest niepoprawne");
                }
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas tworzenia konta: " + e.getMessage());
        }
        return null;
    }

    public void deleteAccountById(Long accountID) {
        try {
            if (accountID == null) {
                throw new IllegalArgumentException("Nieprawidłowy accountID.");
            }
            accountRepository.deleteById(accountID);
            System.out.println("Konto usunięte z bazy danych");
        } catch (Exception e) {
            System.err.println("Błąd podczas usuwania konta: " + e.getMessage());
            throw e;
        }
    }

    public void updateAccountEmail(Long accountID, String email) {
        try {
            if (accountID == null || email == null) {
                throw new IllegalArgumentException("Nieprawidłowy accountID lub adres email.");
            }
            if(emailVerification(email)) {
                Account account = accountRepository.findById(accountID)
                        .orElseThrow(() -> new EntityNotFoundException("Konto o id " + accountID + " nie znalezione."));
                account.setEmail(email);
                accountRepository.save(account);
                System.out.println("Adres email konta został zmieniony.");
            } else {
                System.out.println("Nieprawidłowy format adresu email");
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania adresu email konta: " + e.getMessage());
            throw e;
        }
    }

    public void updateAccountPassword(Long accountID, String password) {
        try {
            if (accountID == null || password == null) {
                throw new IllegalArgumentException("Nieprawidłowy accountID lub hasło.");
            }
            if(passVerification(password)) {
                String salt = SaltGenerator.generateSalt();
                String hashedPassword = PasswordEncoder.hashPassword(password, salt);
                Account account = accountRepository.findById(accountID)
                        .orElseThrow(() -> new EntityNotFoundException("Konto o id " + accountID + " nie znalezione."));
                account.setPassword(hashedPassword);
                account.setSalt(salt);
                accountRepository.save(account);
                System.out.println("Hasło zostało zmienione.");
            } else {
                System.out.println("Nieprawidłowy format hasła.");
            }
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException(ex);
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania hasła: " + e.getMessage());
        }
    }

    public void updateAccountPassword(String email, String password) {
        try {
            if (email == null || password == null) {
                throw new IllegalArgumentException("Nieprawidłowy adres email lub hasło.");
            }
            if (passVerification(password)) {
                String salt = SaltGenerator.generateSalt();
                String hashedPassword = PasswordEncoder.hashPassword(password, salt);
                Account account = accountRepository.findAccountByEmail(email).get(0);

                if (account != null) {
                    account.setPassword(hashedPassword);
                    account.setSalt(salt);
                    accountRepository.save(account);
                    System.out.println("Hasło zostało zmienione");
                } else {
                    System.out.println("Konto o podanym adresie email nie zostało znalezione.");
                }
            } else {
                System.out.println("Nieprawidłowy format hasła.");
            }
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException(ex);
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania hasła: " + e.getMessage());
        }
    }

    public LoggedUser logIn(String email, String password) {
        try {
            Account account = getByEmail(email).get(0);  //There is only one account with this email address
            if (account != null) {
                String salt = account.getSalt();
                String hashedPassword = PasswordEncoder.hashPassword(password, salt);
                if (hashedPassword.equals(account.getPassword())) {
                    if (getEmailUsername(email).equals("employee")) {
                        System.out.println("Zalogowano jako pracownik.");
                        return employeeService.getEmployeeByAccountID(account.getId()).get(0);
                    } else if (getEmailUsername(email).equals("admin")) {
                        System.out.println("Zalogowano jako administrator.");
                        return new Administrator();
                    } else {
                        System.out.println("Zalogowano jako czytelnik.");
                        return readerService.getReaderByAccountID(account.getId()).get(0);
                    }
                } else {
                    System.out.println("Błędne hasło.");
                }
            } else {
                System.out.println("Nie znaleziono konta o podanym adresie email.");
            }
        } catch (IndexOutOfBoundsException ex) {
            System.out.println("Nieprawidłowy adres email");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean isEmailUnique(String email) {
        try {
            if (email == null) {
                throw new IllegalArgumentException("Niepoprawny adres email");
            }
            List<Account> existingAccounts = accountRepository.findAccountByEmail(email);
            return existingAccounts.isEmpty();
        } catch (Exception e) {
            System.err.println("Błąd sprawdzania unikalności adresu email: " + e.getMessage());
            throw e;
        }
    }

    private boolean passVerification(String password) {
        final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!.]).{8,}$";
        Pattern pattern = Pattern.compile(PASSWORD_PATTERN);
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }


    private boolean emailVerification(String email) {
        final String EMAIL_PATTERN = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$";
        Pattern pattern = Pattern.compile(EMAIL_PATTERN);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    private String getEmailUsername(String email) {
        int atIndex = email.indexOf('@');
        int dotIndex = email.indexOf('.', atIndex);
        if (atIndex != -1 && dotIndex != -1) {
            return email.substring(atIndex + 1, dotIndex);
        } else {
            return "";
        }
    }
}