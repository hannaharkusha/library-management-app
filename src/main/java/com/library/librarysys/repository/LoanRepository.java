package com.library.librarysys.repository;

import com.library.librarysys.entity.Loan;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long>, JpaSpecificationExecutor<Loan> {
   default List<Loan> findLoansByReaderId(Long readerID) {
        return findAll(getSpecification("readerID", readerID), Pageable.unpaged()).getContent();
    }

    default List<Loan> findLoansByCopyId(Long copyID) {
        return findAll(getSpecification("copyID", copyID), Pageable.unpaged()).getContent();
    }

    private Specification<Loan> getSpecification(String tableRepresentation, Long id) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get(tableRepresentation), id));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
