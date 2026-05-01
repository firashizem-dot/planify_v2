package com.planify.repository;

import com.planify.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByCode(String code);
    boolean existsByCode(String code);
    boolean existsByName(String name);
    Optional<Department> findByHeadId(Long headId);
}
