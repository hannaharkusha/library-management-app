package com.library.librarysys.controller;

import com.library.librarysys.entity.Library;
import com.library.librarysys.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {
    private final LibraryService libraryService;

    @Autowired
    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @GetMapping("/all")
    public List<Library> getAllLibraries() {
        return libraryService.getLibraries();
    }

    @GetMapping("/byid")
    public List<Library> getByID(Long id) {
        return libraryService.getByID(id);
    }

    @GetMapping("/update/name")
    public void updateLibraryName(Long libraryID, String name) {
        libraryService.updateLibraryName(libraryID, name);
    }

    @GetMapping("/update/location")
    public void updateLibraryLocation(Long libraryID, String location) {
        libraryService.updateLibraryLocation(libraryID, location);
    }

    @GetMapping("/update/phone")
    public void updateLibraryPhoneNum(Long libraryID, String phoneNum) {
        libraryService.updateLibraryPhoneNum(libraryID, phoneNum);
    }
}
