package com.planify.repository;

import com.planify.model.ProfessorPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfessorPreferenceRepository extends JpaRepository<ProfessorPreference, Long> {
    List<ProfessorPreference> findByProfessorId(Long professorId);
    void deleteByProfessorIdAndTimeSlotId(Long professorId, Long timeSlotId);
    boolean existsByProfessorIdAndTimeSlotId(Long professorId, Long timeSlotId);
}
