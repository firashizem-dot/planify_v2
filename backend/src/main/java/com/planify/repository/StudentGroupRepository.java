package com.planify.repository;

import com.planify.model.StudentGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentGroupRepository extends JpaRepository<StudentGroup, Long> {
    List<StudentGroup> findByDepartmentId(Long departmentId);
    Optional<StudentGroup> findByCode(String code);
    boolean existsByCode(String code);
}
