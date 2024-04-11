package com.library.librarysys.service;

import com.library.librarysys.entity.Library;
import com.library.librarysys.entity.LibraryOpening;
import com.library.librarysys.entity.Opening;
import com.library.librarysys.repository.LibraryOpeningRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;


@Service
@Transactional
public class LibraryOpeningService {
    private final LibraryOpeningRepository libraryOpeningRepository;
    private final OpeningService openingService;
    private final LibraryService libraryService;

    @Autowired
    public LibraryOpeningService(LibraryOpeningRepository libraryOpeningRepository, OpeningService openingService, LibraryService libraryService) {
        this.libraryOpeningRepository = libraryOpeningRepository;
        this.openingService = openingService;
        this.libraryService = libraryService;
    }

    public List<LibraryOpening> getByLibraryOpening(Long libraryID, Long openingID) {
        try {
            if (libraryID != null && openingID != null) {
                return libraryOpeningRepository.findByLOID(libraryID, openingID);
            } else if (libraryID != null) {
                return libraryOpeningRepository.findByLibraryID(libraryID);
            } else if (openingID != null) {
                return libraryOpeningRepository.findByOpeningID(openingID);
            } else {
                throw new IllegalArgumentException("Musisz podać co najmniej jedno z libraryID lub openingID.");
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania łącznika: " + e.getMessage());
            throw e;
        }
    }

    public List<Opening> getByDayAndHours(Opening.Day day, LocalTime openHour, LocalTime closeHour) {
        return openingService.findOpening(day, openHour, closeHour);
    }

    public void addLibraryOpening(Long libraryID, Opening.Day day, LocalTime openHour, LocalTime closeHour) {
        try {
            if (libraryID == null || day == null || openHour == null || closeHour == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }

            Opening existingOpening;
            List<Opening> existingOpenings = openingService.findOpening(day, openHour, closeHour);

            if (existingOpenings.isEmpty()) {
                existingOpening = openingService.addOpening(day, openHour, closeHour);
            } else {
                existingOpening = existingOpenings.get(0);
            }

            List<LibraryOpening> existingLibraryOpenings = libraryOpeningRepository.findByLOID(libraryID, existingOpening.getId());

            if (existingLibraryOpenings.isEmpty()) {
                LibraryOpening libOpening = new LibraryOpening(libraryID, existingOpening.getId());
                libraryOpeningRepository.save(libOpening);
                System.out.println("Połączenie dodane");
            } else {
                System.out.println("Połączenie już istnieje");
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas tworzenia połączenia: " + e.getMessage());
            throw e;
        }
    }


//    public boolean deleteLibraryOpening(Long libraryID, Long openingID) {
//        try {
//            List<LibraryOpening> libraryOpenings = libraryOpeningRepository.findByLOID(libraryID, openingID);
//            if (!libraryOpenings.isEmpty()) {
//                libraryOpeningRepository.deleteLibraryOpeningByID(libraryID, openingID);
//                System.out.println("Połączenie usunięte");
//
//                if (!isOpeningConnected(openingID)) {
//                    openingService.deleteOpeningById(openingID);
//                    System.out.println("Otwarcie usunięte");
//                }
//                return true;
//            } else {
//                System.out.println("Błąd podczas usuwania połączenia");
//                throw new RuntimeException("Połączenie o podanym libraryID " + libraryID + " lub openingID " + openingID + " nie znalezione");
//            }
//        } catch (Exception e) {
//            System.err.println("Błąd podczas usuwania połączenia: " + e.getMessage());
//            throw e;
//        }
//    }

    public boolean deleteLibraryOpening(Long libraryID, Opening.Day day) {
        try {
            List<LibraryOpening> libraryOpenings = libraryOpeningRepository.findByLibraryID(libraryID);
            if (!libraryOpenings.isEmpty()) {
                boolean isOpeningWithGivenDayFound = false;
                for (LibraryOpening libraryOpening : libraryOpenings) {
                    Long openingID = libraryOpening.getId().getOpeningID();
                    Opening opening = openingService.getByID(openingID).get(0);
                    if (opening.getDay() == day) {
                        isOpeningWithGivenDayFound = true;
                        libraryOpeningRepository.deleteLibraryOpeningByID(libraryID, openingID);
                        System.out.println("Połączenie usunięte");

                        if (!isOpeningConnected(openingID)) {
                            openingService.deleteOpeningById(openingID);
                            System.out.println("Otwarcie usunięte");
                        }
                    }
                }
                if(isOpeningWithGivenDayFound) return true;
                return true;
            } else {
                return true;
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas usuwania połączenia: " + e.getMessage());
            throw e;
        }
    }

    private boolean isOpeningConnected(Long openingID) {
        List<Library> libraries = libraryService.getLibraries();
        for (Library library : libraries) {
            List<LibraryOpening> libraryOpenings = getByLibraryOpening(library.getId(), openingID);
            if (!libraryOpenings.isEmpty()) {
                return true;
            }
        }
        return false;
    }
}
