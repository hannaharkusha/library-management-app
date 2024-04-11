package com.library.librarysys.service;

import com.library.librarysys.entity.Account;
import com.library.librarysys.entity.Employee;
import com.library.librarysys.entity.Order;
import com.library.librarysys.entity.Reader;
import com.library.librarysys.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public List<Employee> getEmployee(Long employeeID) {
        try {
            if (employeeID == null) {
                throw new IllegalArgumentException("Niepoprawny employeeID");
            }
            return employeeRepository.findAllById(Collections.singleton(employeeID));
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania pracowników: " + e.getMessage());
            throw e;
        }
    }

    public List<Employee> getEmployeeByAccountID(Long accountID) {
        try {
            if (accountID == null) {
                throw new IllegalArgumentException("Niepoprawny acountID");
            }
            return employeeRepository.findAllById(Collections.singleton(accountID));
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania pracowników: " + e.getMessage());
            throw e;
        }
    }

    public void addEmployee(String firstName, String lastName, String address, String phoneNumber, Employee.Position position, Long libraryID, Long accountID) {
        try {
            if (firstName == null || lastName == null || phoneNumber == null || address == null || position == null || libraryID == null || accountID == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }
            firstName = firstName.substring(0, 1).toUpperCase() + firstName.substring(1);
            lastName = lastName.substring(0, 1).toUpperCase() + lastName.substring(1);
            Employee employee = new Employee(firstName, lastName, address, phoneNumber, position, libraryID, accountID);
            employeeRepository.save(employee);
            System.out.println("Pracownik dodany");
        } catch (Exception e) {
            System.err.println("Błąd podczas tworzenia pracownika: " + e.getMessage());
            throw e;
        }
    }

    public void deleteEmployeeById(Long employeeID) {
        try {
            if (employeeID == null) {
                throw new IllegalArgumentException("Nieprawidłowy employeeID.");
            }
            employeeRepository.deleteById(employeeID);
            System.out.println("Pracownik usunięty z bazy danych");
        } catch (Exception e) {
            System.err.println("Błąd podczas usuwania pracownika: " + e.getMessage());
            throw e;
        }
    }

    public void updateEmployeeLastName(Long employeeID, String lastName) {
        try {
            if (employeeID == null || lastName == null) {
                throw new IllegalArgumentException("Nieprawidłowy employeeID lub nazwisko.");
            }
            Employee employee = employeeRepository.findById(employeeID)
                    .orElseThrow(() -> new EntityNotFoundException("Zamówienie o id " + employeeID + " nie znalezione."));
            employee.setLastName(lastName);
            employeeRepository.save(employee);
            System.out.println("Nazwisko pracownika zostało zmienione.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania nazwiska pracownika: " + e.getMessage());
            throw e;
        }
    }

    public void updateEmployeeAddress(Long employeeID, String address) {
        try {
            if (employeeID == null || address == null) {
                throw new IllegalArgumentException("Nieprawidłowy employeeID lub adres.");
            }
            Employee employee = employeeRepository.findById(employeeID)
                    .orElseThrow(() -> new EntityNotFoundException("Zamówienie o id " + employeeID + " nie znalezione."));
            employee.setAddress(address);
            employeeRepository.save(employee);
            System.out.println("Adres pracownika został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania adresu pracownika: " + e.getMessage());
            throw e;
        }
    }

    public void updateEmployeePhoneNum(Long employeeID, String phoneNum) {
        try {
            if (employeeID == null || phoneNum == null) {
                throw new IllegalArgumentException("Nieprawidłowy employeeID lub numer telefonu.");
            }
            Employee employee = employeeRepository.findById(employeeID)
                    .orElseThrow(() -> new EntityNotFoundException("Zamówienie o id " + employeeID + " nie znalezione."));
            employee.setPhoneNumber(phoneNum);
            employeeRepository.save(employee);
            System.out.println("Numer telefonu pracownika został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania numeru telefonu pracownika: " + e.getMessage());
            throw e;
        }
    }

    public void updateEmployeePosition(Long employeeID, Employee.Position position) {
        try {
            if (employeeID == null || position == null) {
                throw new IllegalArgumentException("Nieprawidłowy employeeID lub stanowisko.");
            }
            Employee employee = employeeRepository.findById(employeeID)
                    .orElseThrow(() -> new EntityNotFoundException("Zamówienie o id " + employeeID + " nie znalezione."));
            employee.setPosition(position);
            employeeRepository.save(employee);
            System.out.println("Stanowisko pracownika zostało zmienione.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania stanowiska pracownika: " + e.getMessage());
            throw e;
        }
    }

    public void updateEmployeeLibrary(Long employeeID, Long libraryID) {
        try {
            if (employeeID == null || libraryID == null) {
                throw new IllegalArgumentException("Nieprawidłowy employeeID lub libraryID.");
            }
            Employee employee = employeeRepository.findById(employeeID)
                    .orElseThrow(() -> new EntityNotFoundException("Zamówienie o id " + employeeID + " nie znalezione."));
            employee.setLibraryID(libraryID);
            employeeRepository.save(employee);
            System.out.println("Biblioteka pracownika została zmieniona.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania biblioteki pracownika: " + e.getMessage());
            throw e;
        }
    }
}