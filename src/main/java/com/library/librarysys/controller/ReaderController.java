package com.library.librarysys.controller;

import com.library.librarysys.entity.Account;
import com.library.librarysys.entity.Reader;
import com.library.librarysys.service.ReaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reader")
public class ReaderController {
    private final ReaderService readerService;

    @Autowired
    public ReaderController(ReaderService readerService) {
        this.readerService = readerService;
    }

    @GetMapping("/all")
    public List<Reader> getReader() {
        return readerService.getAllReaders();
    }

    @GetMapping("/byid")
    public List<Reader> getReader(Long readerID) {
        return readerService.getReader(readerID);
    }

    @GetMapping("/byname")
    public List<Reader> getReaderByName(String firstName, String lastName) {
        return readerService.getReaderByName(firstName, lastName);
    }

    @GetMapping("/add")
    public void addReader(String firstName, String lastName, String phoneNum, Account account) {
        readerService.addReader(firstName, lastName, phoneNum, account);
    }

    @GetMapping("/delete")
    public boolean deleteReader(Long readerID) {
        return readerService.deleteReaderById(readerID);
    }

    @GetMapping("/update/lastname")
    public void updateReaderLastName(Long readerID, String lastName) {
        readerService.updateReaderLastName(readerID, lastName);
    }

    @GetMapping("/update/address")
    public void updateReaderAddress(Long readerID, String address) {
        readerService.updateReaderAddress(readerID, address);
    }

    @GetMapping("/update/phone")
    public void updateReaderPhoneNum(Long readerID, String phoneNum) {
        readerService.updateReaderPhoneNum(readerID, phoneNum);
    }
}
