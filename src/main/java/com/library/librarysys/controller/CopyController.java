package com.library.librarysys.controller;

import com.library.librarysys.entity.Book;
import com.library.librarysys.entity.Copy;
import com.library.librarysys.service.CopyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/copy")
public class CopyController {
    private final CopyService copyService;

    @Autowired
    public CopyController(CopyService copyService) {
        this.copyService = copyService;
    }

    @GetMapping("/byid/book")
    public List<Copy> getCopiesByBookID(Long bookID) {
        return copyService.getCopies(bookID);
    }

    @GetMapping("/byid/library")
    public List<Copy> getCopiesByLibraryID(Long libraryID) {
        return copyService.getCopiesByLibraryID(libraryID);
    }

    @GetMapping("/add")
    public void addCopy(String title, String author, String publisher, String ISBN, String releaseYear, Copy.Format format, String language, String blurb, Copy.Status status, Long libraryID) {
        copyService.addCopy(title, author, publisher, ISBN, releaseYear, format, language, blurb, status, libraryID);
    }

    @GetMapping("/delete")
    public void deleteCopyByID(Long copyID) {
        copyService.deleteCopyById(copyID);
    }

    @GetMapping("/update/library")
    public void updateCopyLibrary(Long copyID, Long libraryID) {
        copyService.updateCopyLibrary(copyID, libraryID);
    }

    @GetMapping("/update/status")
    public void updateCopyStatus(Long copyID, Copy.Status status) {
        copyService.updateCopyStatus(copyID, status);
    }

    @GetMapping("/update/blurb")
    public void updateCopyBlurb(Long copyID, String blurb) {
        copyService.updateCopyBlurb(copyID, blurb);
    }
}
