package com.library.librarysys.entity;

import com.library.librarysys.entity.users.LoggedUser;
import com.library.password.PasswordEncoder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "reader")
@Getter @Setter
public class Reader extends LoggedUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reader_id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "library_card_number")
    private Long libraryCardNumber;

    @Column(name = "account_id")
    private Long accountID;


    public Reader() {}

    public Reader(String firstName, String lastName, String address, String phoneNum, Long libraryCardNum, Long accountID) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.phoneNumber = phoneNum;
        this.libraryCardNumber = libraryCardNum;
        this.accountID = accountID;
    }

    public Reader(String firstName, String lastName, String phoneNum, Long accountID) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNum;
        this.accountID = accountID;
    }
}
