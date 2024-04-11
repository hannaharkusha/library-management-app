package com.library.librarysys.controller;

import com.library.librarysys.entity.LibraryOpening;
import com.library.librarysys.entity.Opening;
import com.library.librarysys.service.LibraryOpeningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.util.List;


@RestController
@RequestMapping("/api/libopening")
public class LibraryOpeningController {
    private final LibraryOpeningService libraryOpeningService;

    @Autowired
    public LibraryOpeningController(LibraryOpeningService libraryOpeningService) {
        this.libraryOpeningService = libraryOpeningService;
    }

    @GetMapping("/bylo")
    public List<LibraryOpening> getByLibraryOpening(Long libraryID, Long openingID) {
        return libraryOpeningService.getByLibraryOpening(libraryID, openingID);
    }

    @GetMapping("/add")
    public void addLibraryOpening(Long libraryID, Opening.Day day, LocalTime openHour, LocalTime closeHour) {
        libraryOpeningService.addLibraryOpening(libraryID, day, openHour, closeHour);
    }

    @GetMapping("/delete")
    public boolean deleteLibraryOpening(Long libraryID, Opening.Day day) {
        return libraryOpeningService.deleteLibraryOpening(libraryID, day);
    }
}
