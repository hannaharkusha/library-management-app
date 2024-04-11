package com.library.librarysys.service;

import com.library.librarysys.entity.Book;
import com.library.librarysys.entity.Copy;
import com.library.librarysys.entity.Order;
import com.library.librarysys.entity.Reader;
import com.library.librarysys.repository.BookRepository;
import com.library.librarysys.repository.CopyRepository;
import com.library.librarysys.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class CopyService {

    private final CopyRepository copyRepository;
    private final BookRepository bookRepository;
    private final BookService bookService;

    @Autowired
    public CopyService(CopyRepository copyRepository, BookRepository bookRepository, BookService bookService) {
        this.copyRepository = copyRepository;
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    public List<Copy> getCopies(Long bookID) {
        try {
            if (bookID == null) {
                throw new IllegalArgumentException("Niepoprawny bookID");
            }
            return copyRepository.findCopyByBookId(bookID);
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania egzemplarzy: " + e.getMessage());
            throw e;
        }
    }

    public List<Copy> getCopiesByLibraryID(Long libraryID) {
        try {
            if (libraryID == null) {
                throw new IllegalArgumentException("Niepoprawny libraryID");
            }
            return copyRepository.findCopyByLibraryId(libraryID);
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania egzemplarzy: " + e.getMessage());
            throw e;
        }
    }

    public void addCopy(String title, String author, String publisher, String ISBN, String releaseYear, Copy.Format format, String language, String blurb, Copy.Status status, Long libraryID) {
        try {
            if (publisher == null || ISBN == null || releaseYear == null || format == null || language == null || status == null || libraryID == null || title == null || author == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }

            List<Book> books = bookService.getByTitleAuthor(title, author);
            Book book;
            if (books.isEmpty() || books.get(0) == null) {
                book = bookService.addBook(title, author);
                books.add(book);
                System.out.println("Książka o podanym tytule i autorze dodana");
            }

            Copy copy = new Copy(publisher, ISBN, releaseYear, format, language, blurb, status, libraryID, books.get(0).getId());
            copyRepository.save(copy);
            System.out.println("Egzemplarz dodany");
        } catch (Exception e) {
            System.err.println("Błąd podczas dodawania egzemplarza: " + e.getMessage());
            throw e;
        }
    }

    public void deleteCopyById(Long copyID) {
        try {
            if (copyID == null) {
                throw new IllegalArgumentException("Nieprawidłowy copyID.");
            }
            Copy copy = copyRepository.findById(copyID).orElse(null);
            if(copy == null) throw new IllegalArgumentException("Nie znaleziono egzemplarza o podanym ID");

            Long bookID = copy.getBookID();
            copyRepository.deleteById(copyID);
            System.out.println("Egzemplarz usunięty z bazy danych");

            if(isCopyUnique(bookID)) {
                bookRepository.deleteById(bookID);
                System.out.println("Książka usunięta z bazy danych");
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas usuwania egzemplarza: " + e.getMessage());
            throw e;
        }
    }

    public void updateCopyLibrary(Long copyID, Long libraryID) {
        try {
            if (copyID == null || libraryID == null) {
                throw new IllegalArgumentException("Nieprawidłowy copyID lub libraryID.");
            }
            Copy copy = copyRepository.findById(copyID)
                    .orElseThrow(() -> new EntityNotFoundException("Egzemplarz o id " + copyID + " nie znaleziony."));
            copy.setLibraryID(libraryID);
            copyRepository.save(copy);
            System.out.println("Biblioteka egzemplarza została zmieniona.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania biblioteki egzemplarza: " + e.getMessage());
            throw e;
        }
    }

    public void updateCopyStatus(Long copyID, Copy.Status status) {
        try {
            if (copyID == null || status == null) {
                throw new IllegalArgumentException("Nieprawidłowy copyID lub status.");
            }
            Copy copy = copyRepository.findById(copyID)
                    .orElseThrow(() -> new EntityNotFoundException("Egzemplarz o id " + copyID + " nie znaleziony."));
            copy.setStatus(status);
            copyRepository.save(copy);
            System.out.println("Status egzemplarza został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania statusu egzemplarza: " + e.getMessage());
            throw e;
        }
    }

    public void updateCopyBlurb(Long copyID, String blurb) {
        try {
            if (copyID == null) {
                throw new IllegalArgumentException("Nieprawidłowy copyID.");
            }
            Copy copy = copyRepository.findById(copyID)
                    .orElseThrow(() -> new EntityNotFoundException("Egzemplarz o id " + copyID + " nie znaleziony."));
            copy.setBlurb(blurb);
            copyRepository.save(copy);
            System.out.println("Opis egzemplarza został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania opisu egzemplarza: " + e.getMessage());
            throw e;
        }
    }

    private boolean isCopyUnique(Long bookID) {
        List<Copy> copies = getCopies(bookID);
        return copies.isEmpty();
    }
}