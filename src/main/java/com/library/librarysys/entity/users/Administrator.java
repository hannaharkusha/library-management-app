package com.library.librarysys.entity.users;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Administrator extends LoggedUser {
    private final String firstName;
    private final String lastName;
    private final String phoneNum;
    private final Long accountID;

    private Double dailyOverdueCost = 0.1;  //in grosz currency


    public Administrator() {
        firstName = null;
        lastName = null;
        phoneNum = null;
        accountID = null;
    }
    public Administrator(String firstName, String lastName, String phoneNum, Long accountID) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNum = phoneNum;
        this.accountID = accountID;
    }
}
