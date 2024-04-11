package com.library.librarysys.entity;

import com.library.librarysys.controller.AccountController;
import com.library.librarysys.entity.users.LoggedUser;
import com.library.password.PasswordEncoder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "employee")
@Getter @Setter
public class Employee extends LoggedUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "position")
    private Position position;

    @Column(name = "library_id")
    private Long libraryID;

    @Column(name = "account_id")
    private Long accountID;

    public enum Position {
        LIBRARIAN,
        MANAGER
    }


    public Employee() {}

    public Employee(String firstName, String lastName, String address, String phoneNum, Position position, Long libraryID, Long accountID) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.phoneNumber = phoneNum;
        this.position = position;
        this.libraryID = libraryID;
        this.accountID = accountID;
    }
}
