package com.library.librarysys.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "copy")
@Getter @Setter
public class Copy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "copy_id")
    private Long id;

    @Column(name = "publisher")
    private String publisher;

    @Column(name = "isbn")
    private String ISBN;

    @Column(name = "release_year")
    private String releaseYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "format")
    private Format format;

    @Column(name = "language")
    private String language;

    @Column(name = "blurb")
    private String blurb;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "library_id")
    private Long libraryID;

    @Column(name = "book_id")
    private Long bookID;


    public enum Format {
        BOOK,
        EBOOK
    }
    public enum Status {
        AVAILABLE,
        UNAVAILABLE
    }

    // Constructors
    public Copy() {}

    public Copy(String publisher, String ISBN, String releaseYear, Format format, String language, String blurb, Status status, Long libraryID, Long bookID) {
        this.publisher = publisher;
        this.ISBN = ISBN;
        this.releaseYear = releaseYear;
        this.format = format;
        this.language = language;
        this.blurb = blurb;
        this.status = status;
        this.libraryID = libraryID;
        this.bookID = bookID;
    }
}
