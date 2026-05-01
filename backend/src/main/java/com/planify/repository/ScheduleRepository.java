package com.planify.repository;

import com.planify.model.Schedule;
import com.planify.model.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDepartmentId(Long departmentId);
    List<Schedule> findByDepartmentIdAndStatus(Long departmentId, ScheduleStatus status);
    Optional<Schedule> findByDepartmentIdAndStatusAndSemesterAndAcademicYear(
            Long departmentId, ScheduleStatus status, String semester, String academicYear);
    List<Schedule> findByStatus(ScheduleStatus status);
}
