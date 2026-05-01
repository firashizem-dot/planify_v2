package com.planify.repository;

import com.planify.model.TimeSlot;
import com.planify.model.enums.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByDepartmentId(Long departmentId);
    List<TimeSlot> findByDepartmentIdOrderByDayOfWeekAscStartTimeAsc(Long departmentId);
    List<TimeSlot> findByDepartmentIdAndDayOfWeek(Long departmentId, DayOfWeek dayOfWeek);
}
