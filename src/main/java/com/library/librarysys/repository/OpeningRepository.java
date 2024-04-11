package com.library.librarysys.repository;

import com.library.librarysys.entity.Opening;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public interface OpeningRepository extends JpaRepository<Opening, Long>, JpaSpecificationExecutor<Opening> {
    default List<Opening> findOpening(Opening.Day day, LocalTime openHour, LocalTime closeHour) {
        return findAll(getSpecification(day, openHour, closeHour));
    }

    private Specification<Opening> getSpecification(Opening.Day day, LocalTime openHour, LocalTime closeHour) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("day"), day));
            predicates.add(criteriaBuilder.equal(root.get("openHour"), openHour));
            predicates.add(criteriaBuilder.equal(root.get("closeHour"), closeHour));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
