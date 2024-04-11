package com.library.librarysys.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "library")
@Getter @Setter
public class Library {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "library_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "phone_number")
    private String phoneNum;

    @Column(name = "email")
    private String email;


    public Library() {}

    public Library(String name, String location, String phoneNum, String email) {
        this.name = name;
        this.location = location;
        this.phoneNum = phoneNum;
        this.email = email;
    }
}
