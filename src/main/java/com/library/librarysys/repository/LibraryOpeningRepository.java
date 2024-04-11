package com.library.librarysys.repository;

import com.library.librarysys.entity.LibraryOpening;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface LibraryOpeningRepository extends JpaRepository<LibraryOpening, Long>, JpaSpecificationExecutor<LibraryOpening> {

   default List<LibraryOpening> findByLibraryID(Long libraryID) {
        return findAll(getSpecification(libraryID, null));
    }

    default List<LibraryOpening> findByOpeningID(Long openingID) {
        return findAll(getSpecification(null, openingID));
    }

    default List<LibraryOpening> findByLOID(Long libraryID, Long openingID) {
        return findAll(getSpecification(libraryID, openingID));
    }

    @Modifying
    @Transactional
    default void deleteLibraryOpeningByID(Long libraryID, Long openingID) {
        Iterable<LibraryOpening> libraryOpenings = findAll(getSpecification(libraryID, openingID));
        deleteAll(libraryOpenings);
    }

    private Specification<LibraryOpening> getSpecification(Long libraryID, Long openingID) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (libraryID != null) {
                predicates.add(criteriaBuilder.equal(root.get("id").get("libraryID"), libraryID));
            }
            if (openingID != null) {
                predicates.add(criteriaBuilder.equal(root.get("id").get("openingID"), openingID));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
