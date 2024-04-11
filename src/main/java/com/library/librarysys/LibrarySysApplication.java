package com.library.librarysys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@SpringBootApplication
public class LibrarySysApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibrarySysApplication.class, args);
    }

    @RestController
    public static class ReceiveDataController {
        @PostMapping("/receiveData")
        public String receiveData(@RequestBody Map<String, String> data) {
            String name = data.get("name");
            System.out.println("Odebrano imię: " + name);
            return "Imię odebrane na serwerze: " + name;
        }
    }

}