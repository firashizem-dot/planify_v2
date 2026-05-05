package com.planify.repository;

import com.planify.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByStudentGroupId(Long groupId);
    long countByStudentGroupId(Long groupId);
    boolean existsByUserId(Long userId);
}
