package com.library.librarysys.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "loan")
@Getter @Setter
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_id")
    private Long id;

    @Column(name = "loan_date")
    private LocalDate loanDate;

    @Column(name = "return_date")
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "employee_id")
    private Long employeeID;

    @Column(name = "copy_id")
    private Long copyID;

    @Column(name = "reader_id")
    private Long readerID;


    public enum Status {
        ACTIVE,
        RETURNED,
        OVERDUE
    }

    public Loan() {}

    public Loan(Long employeeID, Long copyID, Long readerID) {
        this.loanDate = LocalDate.now();
        this.returnDate = loanDate.plusDays(30);
        this.status = Status.ACTIVE;
        this.employeeID = employeeID;
        this.copyID = copyID;
        this.readerID = readerID;
    }
}
