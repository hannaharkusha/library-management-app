package com.library.librarysys.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Getter @Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orders_id")
    private Long id;

    @Column(name = "orders_date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "reader_id")
    private Long readerID;

    @Column(name = "copy_id")
    private Long copyID;


    public enum Status {
        READY,
        REMAINING
    }

    // Constructors
    public Order() {}

    public Order(Long readerID, Long copyID) {
        this.date = LocalDate.now();
        this.status = Status.REMAINING;
        this.readerID = readerID;
        this.copyID = copyID;
    }
}
