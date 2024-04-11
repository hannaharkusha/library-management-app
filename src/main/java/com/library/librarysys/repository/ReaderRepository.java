package com.library.librarysys.repository;

import com.library.librarysys.entity.Reader;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface ReaderRepository extends JpaRepository<Reader, Long>, JpaSpecificationExecutor<Reader> {
     default List<Reader> findReaderByAccountID(Long accountID) {
        return findAll(getSpecification(accountID), Pageable.unpaged()).getContent();
    }

    default List<Reader> findReaderByName(String firstName, String lastName) {
        return findAll(getDoubleSpecification(firstName, lastName), Pageable.unpaged()).getContent();
    }

    private Specification<Reader> getSpecification(Long accountID) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("accountID"), accountID));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
    private Specification<Reader> getDoubleSpecification(String firstName, String lastName) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if(firstName != null && lastName != null) {
                predicates.add(criteriaBuilder.equal(root.get("firstName"), firstName));
                predicates.add(criteriaBuilder.equal(root.get("lastName"), lastName));
            } else if (firstName == null) {
                predicates.add(criteriaBuilder.equal(root.get("lastName"), lastName));
            } else {
                predicates.add(criteriaBuilder.equal(root.get("firstName"), firstName));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
