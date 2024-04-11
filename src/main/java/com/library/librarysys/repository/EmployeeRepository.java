package com.library.librarysys.repository;

import com.library.librarysys.entity.Account;
import com.library.librarysys.entity.Employee;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {
    default List<Employee> findEmployeeByAccountID(Long accountID) {
        return findAll(getSpecification(accountID), Pageable.unpaged()).getContent();
    }

    private Specification<Employee> getSpecification(Long accountID) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("accountID"), accountID));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
