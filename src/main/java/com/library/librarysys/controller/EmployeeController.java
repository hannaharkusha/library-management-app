package com.library.librarysys.controller;

import com.library.librarysys.entity.Account;
import com.library.librarysys.entity.Employee;
import com.library.librarysys.entity.Reader;
import com.library.librarysys.entity.users.Administrator;
import com.library.librarysys.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/all")
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/byid")
    public List<Employee> getEmployee(Long employeeID) {
        return employeeService.getEmployee(employeeID);
    }

    @GetMapping("/add")
    public void addEmployee(String firstName, String lastName, String address, String phoneNumber, Employee.Position position, Long libraryID, Long accountID) {
        employeeService.addEmployee(firstName, lastName, address, phoneNumber, position, libraryID, accountID);
    }

    @GetMapping("/delete")
    public void deleteEmployee(Long employeeID) {
        employeeService.deleteEmployeeById(employeeID);
    }

    @GetMapping("/update/lastName")
    public void updateEmployeeLastName(Long employeeID, String lastName) {
        employeeService.updateEmployeeLastName(employeeID, lastName);
    }

    @GetMapping("/update/address")
    public void updateEmployeeAddress(Long employeeID, String address) {
        employeeService.updateEmployeeAddress(employeeID, address);
    }

    @GetMapping("/update/phone")
    public void updateEmployeePhoneNum(Long employeeID, String phoneNum) {
        employeeService.updateEmployeePhoneNum(employeeID, phoneNum);
    }

    @GetMapping("/update/position")
    public void updateEmployeeLastName(Long employeeID, Employee.Position position) {
        employeeService.updateEmployeePosition(employeeID, position);
    }

    @GetMapping("/update/library")
    public void updateEmployeeLastName(Long employeeID, Long libraryID) {
        employeeService.updateEmployeeLibrary(employeeID, libraryID);
    }
}
