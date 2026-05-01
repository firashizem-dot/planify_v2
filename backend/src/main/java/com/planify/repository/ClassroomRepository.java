package com.planify.repository;

import com.planify.model.Classroom;
import com.planify.model.enums.ClassroomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    List<Classroom> findByType(ClassroomType type);
    List<Classroom> findByDepartmentId(Long departmentId);
    List<Classroom> findByCapacityGreaterThanEqual(Integer minCapacity);
    Optional<Classroom> findByCode(String code);
    boolean existsByCode(String code);
}
