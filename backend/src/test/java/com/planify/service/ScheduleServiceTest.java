package com.planify.service;

import com.planify.dto.ScheduleDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Department;
import com.planify.model.Schedule;
import com.planify.model.enums.ScheduleStatus;
import com.planify.optaplanner.service.TimetableSolverService;
import com.planify.repository.ScheduleRepository;
import com.planify.repository.ScheduleSessionRepository;
import com.planify.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires (Mockito) de l'automate d'états GENERATED → VALIDATED → PUBLISHED.
 * Cas Qase : Planify-6 (TC-PLAN-SVC-01), Planify-7 (TC-PLAN-SVC-02).
 * Lancement : mvn test -Dtest=ScheduleServiceTest
 */
@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock ScheduleRepository scheduleRepository;
    @Mock ScheduleSessionRepository sessionRepository;
    @Mock UserRepository userRepository;
    @Mock TimetableSolverService solverService;
    @InjectMocks ScheduleService service;

    private Schedule schedule(ScheduleStatus status) {
        Department d = Department.builder().id(1L).name("Informatique").code("INFO").build();
        return Schedule.builder().id(10L).department(d).semester("S1").academicYear("2025-2026").status(status).build();
    }

    @Test
    @DisplayName("Planify-6 — validate : GENERATED → VALIDATED")
    void validate_fromGenerated() {
        when(scheduleRepository.findById(10L)).thenReturn(Optional.of(schedule(ScheduleStatus.GENERATED)));
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(inv -> inv.getArgument(0));
        ScheduleDto dto = service.validateSchedule(10L);
        assertThat(dto.getStatus()).isEqualTo(ScheduleStatus.VALIDATED);
    }

    @Test
    @DisplayName("Planify-6 — validate depuis VALIDATED : refusé")
    void validate_fromValidated_rejected() {
        when(scheduleRepository.findById(10L)).thenReturn(Optional.of(schedule(ScheduleStatus.VALIDATED)));
        assertThatThrownBy(() -> service.validateSchedule(10L))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Only GENERATED schedules can be validated");
        verify(scheduleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Planify-7 — publish depuis GENERATED : refusé (transition interdite)")
    void publish_fromGenerated_rejected() {
        when(scheduleRepository.findById(10L)).thenReturn(Optional.of(schedule(ScheduleStatus.GENERATED)));
        assertThatThrownBy(() -> service.publishSchedule(10L))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Only VALIDATED schedules can be published");
    }

    @Test
    @DisplayName("Planify-7 — publish : VALIDATED → PUBLISHED")
    void publish_fromValidated() {
        when(scheduleRepository.findById(10L)).thenReturn(Optional.of(schedule(ScheduleStatus.VALIDATED)));
        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(inv -> inv.getArgument(0));
        assertThat(service.publishSchedule(10L).getStatus()).isEqualTo(ScheduleStatus.PUBLISHED);
    }

    @Test
    @DisplayName("Planify-7 — delete d'un EDT inexistant : ResourceNotFoundException")
    void delete_missing() {
        when(scheduleRepository.existsById(99L)).thenReturn(false);
        assertThatThrownBy(() -> service.deleteSchedule(99L)).isInstanceOf(ResourceNotFoundException.class);
    }
}
