package com.library.librarysys.controller;

import com.library.librarysys.entity.Opening;
import com.library.librarysys.service.OpeningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/opening")
public class OpeningController {
    private final OpeningService openingService;

    @Autowired
    public OpeningController(OpeningService openingService) {
        this.openingService = openingService;
    }

    @GetMapping("/byid")
    public List<Opening> getOpening(Long openingID) {
        return openingService.getByID(openingID);
    }

    @GetMapping("/add")
    public ResponseEntity<Opening> addOpening(Opening.Day day, LocalTime openHour, LocalTime closeHour) {
        Opening opening = new Opening(day, openHour, closeHour);
        if (opening != null) {
            return ResponseEntity.ok(opening);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
