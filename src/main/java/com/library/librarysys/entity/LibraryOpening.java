package com.library.librarysys.entity;

import com.library.librarysys.entity.libraryopeningid.LibraryOpeningID;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "library_opening")
@Getter @Setter
public class LibraryOpening {

    @EmbeddedId
    private LibraryOpeningID id;

    public LibraryOpening() {
    }

    public LibraryOpening(Long libraryID, Long openingID) {
        this.id = new LibraryOpeningID(libraryID, openingID);
    }
}
