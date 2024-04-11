package com.library.librarysys.service;

import com.library.librarysys.entity.Account;
import com.library.librarysys.entity.Book;
import com.library.librarysys.repository.BookRepository;
import com.library.password.PasswordEncoder;
import com.library.password.SaltGenerator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public List<Book> getByTitleAuthor(String title, String author) {
        return bookRepository.findByTitleAuthor(title, author);
    }

    public Book addBook(String title, String author) {
        try {
            if (title == null || author == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }
            if (isBookUnique(title, author)) {
                Book book = new Book(title, author);
                bookRepository.save(book);
                System.out.println("Książka o podanym tytule dodane");
                return book;
            } else {
                System.out.println("Istnieje już ta książka w bazie danych");
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas dodawania książki: " + e.getMessage());
        }
        return null;
    }
 
    public boolean isBookUnique(String title, String author) {
        try {
            if (title == null || author == null) {
                throw new IllegalArgumentException("Niepoprawny adres email");
            }
            List<Book> existingBooks = bookRepository.findByTitleAuthor(title, author);
            return existingBooks.isEmpty();
        } catch (Exception e) {
            System.err.println("Błąd sprawdzania unikalności książki: " + e.getMessage());
            throw e;
        }
    }
}