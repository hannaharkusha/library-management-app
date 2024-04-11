package com.library.librarysys.repository;
import com.library.librarysys.entity.Book;
import com.library.librarysys.entity.LibraryOpening;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
    default List<Book> findByTitleAuthor(String title, String author) {
        return findAll(getSpecification(title, author));
    }

    private Specification<Book> getSpecification(String title, String author) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("title"), title));
            predicates.add(criteriaBuilder.equal(root.get("author"), author));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}