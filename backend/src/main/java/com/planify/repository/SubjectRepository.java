package com.planify.repository;

import com.planify.model.Subject;
import com.planify.model.enums.CourseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByDepartmentId(Long departmentId);
    List<Subject> findByDepartmentIdAndCourseType(Long departmentId, CourseType courseType);
    Optional<Subject> findByCode(String code);
    boolean existsByCode(String code);

    @org.springframework.data.jpa.repository.Query(
        "SELECT s FROM Subject s WHERE s.department.id = :deptId AND (s.semester = :semester OR s.semester IS NULL)"
    )
    List<Subject> findByDepartmentIdAndSemesterOrNull(
        @org.springframework.data.repository.query.Param("deptId") Long deptId,
        @org.springframework.data.repository.query.Param("semester") String semester
    );
}
