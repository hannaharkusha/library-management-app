package com.library.librarysys.repository;

import com.library.librarysys.entity.Copy;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface CopyRepository extends JpaRepository<Copy, Long>, JpaSpecificationExecutor<Copy> {
     default List<Copy> findCopyByBookId(Long bookID) {
        return findAll(getSpecification("bookID", bookID), Pageable.unpaged()).getContent();
    }

    default List<Copy> findCopyByLibraryId(Long libraryID) {
        return findAll(getSpecification("libraryID", libraryID), Pageable.unpaged()).getContent();
    }

    private Specification<Copy> getSpecification(String tableRepresentation, Long id) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get(tableRepresentation), id));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
