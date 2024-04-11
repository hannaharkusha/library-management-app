package com.library.librarysys.repository;

import com.library.librarysys.entity.Account;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>, JpaSpecificationExecutor<Account> {
    default List<Account> findAccountByEmail(String email) {
        return findAll(getSpecification(email), Pageable.unpaged()).getContent();
    }

    private Specification<Account> getSpecification(String email) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("email"), email));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
