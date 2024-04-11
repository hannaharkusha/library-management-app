package com.library.librarysys.repository;

import com.library.librarysys.entity.Order;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
     default List<Order> findOrdersByReaderId(Long readerId) {
        return findAll(getSpecification("readerID", readerId), Pageable.unpaged()).getContent();
    }

    default List<Order> findOrdersByCopyId(Long copyID) {
        return findAll(getSpecification("copyID", copyID), Pageable.unpaged()).getContent();
    }

    private Specification<Order> getSpecification(String tableRepresentation, Long id) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get(tableRepresentation), id));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
