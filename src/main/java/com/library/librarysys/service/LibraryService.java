package com.library.librarysys.service;

import com.library.librarysys.entity.Library;
import com.library.librarysys.repository.LibraryRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class LibraryService {
    private final LibraryRepository libraryRepository;

    @Autowired
    public LibraryService(LibraryRepository libraryRepository) {
        this.libraryRepository = libraryRepository;
    }

    public List<Library> getLibraries() {
        return libraryRepository.findAll();
    }
    public List<Library> getByID(Long id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Niepoprawny libraryID");
            }
            return libraryRepository.findAllById(Collections.singleton(id));
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania danych o bibliotece: " + e.getMessage());
            throw e;
        }
    }

    public void updateLibraryName(Long libraryID, String name) {
        try {
            if (libraryID == null || name == null) {
                throw new IllegalArgumentException("Nieprawidłowy libraryID lub nazwa.");
            }
            Library library = libraryRepository.findById(libraryID)
                    .orElseThrow(() -> new EntityNotFoundException("Biblioteka o id " + libraryID + " nie znaleziona."));
            library.setName(name);
            libraryRepository.save(library);
            System.out.println("Nazwa biblioteki została zmieniona.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania nazwy biblioteki: " + e.getMessage());
            throw e;
        }
    }

    public void updateLibraryLocation(Long libraryID, String location) {
        try {
            if (libraryID == null || location == null) {
                throw new IllegalArgumentException("Nieprawidłowy libraryID lub lokalizacja.");
            }
            Library library = libraryRepository.findById(libraryID)
                    .orElseThrow(() -> new EntityNotFoundException("Biblioteka o id " + libraryID + " nie znaleziona."));
            library.setLocation(location);
            libraryRepository.save(library);
            System.out.println("Lokalizacja biblioteki została zmieniona.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania lokalizacji biblioteki: " + e.getMessage());
            throw e;
        }
    }

    public void updateLibraryPhoneNum(Long libraryID, String phoneNum) {
        try {
            if (libraryID == null || phoneNum == null) {
                throw new IllegalArgumentException("Nieprawidłowy libraryID lub numer telefonu.");
            }
            Library library = libraryRepository.findById(libraryID)
                    .orElseThrow(() -> new EntityNotFoundException("Biblioteka o id " + libraryID + " nie znaleziona."));
            library.setPhoneNum(phoneNum);
            libraryRepository.save(library);
            System.out.println("Numer telefonu biblioteki został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania numeru telefonu: " + e.getMessage());
            throw e;
        }
    }
}
