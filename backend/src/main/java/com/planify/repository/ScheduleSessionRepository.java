package com.planify.repository;

import com.planify.model.ScheduleSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleSessionRepository extends JpaRepository<ScheduleSession, Long> {
    List<ScheduleSession> findByScheduleId(Long scheduleId);

    @Query("SELECT s FROM ScheduleSession s JOIN FETCH s.subject JOIN FETCH s.classroom " +
           "JOIN FETCH s.timeSlot JOIN FETCH s.studentGroup " +
           "WHERE s.professor.id = :professorId AND s.schedule.status = 'PUBLISHED'")
    List<ScheduleSession> findPublishedSessionsByProfessor(@Param("professorId") Long professorId);

    @Query("SELECT s FROM ScheduleSession s JOIN FETCH s.subject JOIN FETCH s.classroom " +
           "JOIN FETCH s.timeSlot JOIN FETCH s.professor " +
           "WHERE s.studentGroup.id = :groupId AND s.schedule.status = 'PUBLISHED'")
    List<ScheduleSession> findPublishedSessionsByGroup(@Param("groupId") Long groupId);

    void deleteByScheduleId(Long scheduleId);
}
