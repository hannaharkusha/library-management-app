package com.library.librarysys.service;

import com.library.librarysys.entity.Opening;
import com.library.librarysys.repository.OpeningRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class OpeningService {
    private final OpeningRepository openingRepository;

    @Autowired
    public OpeningService(OpeningRepository openingRepository) {
        this.openingRepository = openingRepository;
    }
    public List<Opening> getByID(Long id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Niepoprawny openingID");
            }
            return openingRepository.findAllById(Collections.singleton(id));
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania danych o otwarciu: " + e.getMessage());
            throw e;
        }
    }

    public List<Opening> findOpening(Opening.Day day, LocalTime openHour, LocalTime closeHour) {
        return openingRepository.findOpening(day, openHour, closeHour);
    }

    public Opening addOpening(Opening.Day day, LocalTime openHour, LocalTime closeHour) {
        try {
            if (day == null || openHour == null || closeHour == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }
            if (isOpeningUnique(day, openHour, closeHour)) {
                Opening opening = new Opening(day, openHour, closeHour);
                openingRepository.save(opening);
                System.out.println("Otwarcie dodane");
                return opening;
            } else {
                System.out.println("Takie otwarcie już istnieje");
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas dodawania otwarcia: " + e.getMessage());
        }
        return null;
    }

    public void deleteOpeningById(Long openingID) {
        try {
            if (openingID == null) {
                throw new IllegalArgumentException("Nieprawidłowy openingID.");
            }
            openingRepository.deleteById(openingID);
            System.out.println("Otwarcie usunięte z bazy danych");
        } catch (Exception e) {
            System.err.println("Błąd podczas usuwania otwarcia: " + e.getMessage());
            throw e;
        }
    }

    public boolean isOpeningUnique(Opening.Day day, LocalTime openHour, LocalTime closeHour) {      //if the given opening does not exist in the table
        try {
            if (day == null || openHour == null || closeHour == null) {
                throw new IllegalArgumentException("Niepoprawne dane otwarcia");
            }
            List<Opening> existingOpenings = openingRepository.findOpening(day, openHour, closeHour);
            return existingOpenings.isEmpty();
        } catch (Exception e) {
            System.err.println("Błąd sprawdzania unikalności otwarcia: " + e.getMessage());
            throw e;
        }
    }
}