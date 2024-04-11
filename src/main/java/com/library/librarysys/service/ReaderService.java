package com.library.librarysys.service;

import com.library.librarysys.entity.Account;
import com.library.librarysys.entity.Employee;
import com.library.librarysys.entity.Order;
import com.library.librarysys.entity.Reader;
import com.library.librarysys.repository.ReaderRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class ReaderService {

    private final ReaderRepository readerRepository;

    @Autowired
    public ReaderService(ReaderRepository readerRepository) {
        this.readerRepository = readerRepository;
    }

    public List<Reader> getAllReaders() {
        return readerRepository.findAll();
    }

    public List<Reader> getReader(Long readerID) {
        try {
            if (readerID == null) {
                throw new IllegalArgumentException("Niepoprawny readerID");
            }
            return readerRepository.findAllById(Collections.singleton(readerID));
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania czytelników: " + e.getMessage());
            throw e;
        }
    }

    public List<Reader> getReaderByAccountID(Long accountID) {
        try {
            if (accountID == null) {
                throw new IllegalArgumentException("Niepoprawny accountID");
            }
            return readerRepository.findReaderByAccountID(accountID);
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania czytelników: " + e.getMessage());
            throw e;
        }
    }

    public List<Reader> getReaderByName(String firstName, String lastName) {
        try {
            if (firstName == null && lastName == null) {
                throw new IllegalArgumentException("Niepoprawna fraza");
            }
            return readerRepository.findReaderByName(firstName, lastName);
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania czytelników: " + e.getMessage());
            throw e;
        }
    }

    public void addReader(String firstName, String lastName, String phoneNumber, Account account) {
        try {
            if (firstName == null || lastName == null || phoneNumber == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }
            Reader reader = new Reader(firstName, lastName, phoneNumber, account.getId());
            readerRepository.save(reader);
            Long readerId = reader.getId();
            reader.setLibraryCardNumber(Long.parseLong(generateLibraryCardNumber(readerId)));
            readerRepository.save(reader);

            System.out.println("Czytelnik dodany");
        } catch (Exception e) {
            System.err.println("Błąd podczas tworzenia czytelnika: " + e.getMessage());
            throw e;
        }
    }

    public boolean deleteReaderById(Long readerID) {
        try {
            if (readerID == null) {
                throw new IllegalArgumentException("Nieprawidłowy readerID.");
            }
            readerRepository.deleteById(readerID);
            System.out.println("Czytelnik usunięty z bazy danych");
            return true;
        } catch (Exception e) {
            System.err.println("Błąd podczas usuwania czytelnika: " + e.getMessage());
            throw e;
        }
    }

    public void updateReaderLastName(Long readerID, String lastName) {
        try {
            if (readerID == null || lastName == null) {
                throw new IllegalArgumentException("Nieprawidłowy readerID lub nazwisko.");
            }
            Reader reader = readerRepository.findById(readerID)
                    .orElseThrow(() -> new EntityNotFoundException("Czytelnik o id " + readerID + " nie znalezione."));
            reader.setLastName(lastName);
            readerRepository.save(reader);
            System.out.println("Nazwisko czytelnika zostało zmienione.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania nazwiska czytelnika: " + e.getMessage());
            throw e;
        }
    }

    public void updateReaderAddress(Long readerID, String address) {
        try {
            if (readerID == null || address == null) {
                throw new IllegalArgumentException("Nieprawidłowy readerID lub adres.");
            }
            Reader reader = readerRepository.findById(readerID)
                    .orElseThrow(() -> new EntityNotFoundException("Czytelnik o id " + readerID + " nie znalezione."));
            reader.setAddress(address);
            readerRepository.save(reader);
            System.out.println("Adres czytelnika został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania adresu czytelnika: " + e.getMessage());
            throw e;
        }
    }

    public void updateReaderPhoneNum(Long readerID, String phoneNum) {
        try {
            if (readerID == null || phoneNum == null) {
                throw new IllegalArgumentException("Nieprawidłowy readerID lub numer telefonu.");
            }
            Reader reader = readerRepository.findById(readerID)
                    .orElseThrow(() -> new EntityNotFoundException("Czytelnik o id " + readerID + " nie znalezione."));
            reader.setPhoneNumber(phoneNum);
            readerRepository.save(reader);
            System.out.println("Numer telefonu czytelnika został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania numeru telefonu czytelnika: " + e.getMessage());
            throw e;
        }
    }

    private String generateLibraryCardNumber(Long readerId) {
        return String.format("1%05d", readerId);
    }
}