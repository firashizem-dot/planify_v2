package com.planify.repository;

import com.planify.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByUserId(Long userId);
    List<Professor> findByDepartmentId(Long departmentId);

    @Query("SELECT p FROM Professor p JOIN FETCH p.user JOIN FETCH p.department WHERE p.department.id = :deptId")
    List<Professor> findByDepartmentIdWithDetails(@Param("deptId") Long departmentId);

    boolean existsByUserId(Long userId);
}
