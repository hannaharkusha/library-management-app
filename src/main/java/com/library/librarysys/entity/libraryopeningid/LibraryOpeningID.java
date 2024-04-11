package com.library.librarysys.entity.libraryopeningid;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter @Setter
public class LibraryOpeningID implements Serializable {

    @Column(name = "library_id")
    private Long libraryID;

    @Column(name = "opening_id")
    private Long openingID;

    public LibraryOpeningID(Long libraryID, Long openingID) {
        this.libraryID = libraryID;
        this.openingID = openingID;
    }

    public LibraryOpeningID() {}
}
