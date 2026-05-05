package com.planify.service;

import com.planify.dto.ProfessorDto;
import com.planify.dto.ProfessorPreferenceDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.*;
import com.planify.model.enums.UserRole;
import com.planify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectRepository subjectRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ProfessorPreferenceRepository preferenceRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ProfessorDto> getAllProfessors() {
        return professorRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<ProfessorDto> getProfessorsByDepartment(Long deptId) {
        return professorRepository.findByDepartmentId(deptId).stream().map(this::toDto).toList();
    }

    public ProfessorDto getProfessorById(Long id) {
        return toDto(professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor", id)));
    }

    @Transactional
    public ProfessorDto createProfessor(ProfessorDto dto) {
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));

        User user;
        if (dto.getUserId() != null) {
            // Link to existing user
            if (professorRepository.existsByUserId(dto.getUserId()))
                throw new BadRequestException("Professor already exists for user: " + dto.getUserId());
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", dto.getUserId()));
        } else {
            // Create a new PROFESSOR user account inline
            if (dto.getEmail() == null || dto.getEmail().isBlank())
                throw new BadRequestException("Email is required");
            if (dto.getFirstName() == null || dto.getFirstName().isBlank())
                throw new BadRequestException("First name is required");
            if (dto.getLastName() == null || dto.getLastName().isBlank())
                throw new BadRequestException("Last name is required");
            if (dto.getPassword() == null || dto.getPassword().isBlank())
                throw new BadRequestException("Password is required");
            if (userRepository.existsByEmail(dto.getEmail()))
                throw new BadRequestException("Email already in use: " + dto.getEmail());

            user = new User();
            user.setEmail(dto.getEmail());
            user.setFirstName(dto.getFirstName());
            user.setLastName(dto.getLastName());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setRole(UserRole.PROFESSOR);
            user.setEnabled(true);
            user.setDepartment(dept);
            user = userRepository.save(user);
        }

        Professor prof = new Professor();
        prof.setUser(user);
        prof.setDepartment(dept);
        prof.setSpecialization(dto.getSpecialization());
        prof.setMaxHoursPerWeek(dto.getMaxHoursPerWeek() != null ? dto.getMaxHoursPerWeek() : 18);

        if (dto.getSubjectIds() != null) {
            Set<Subject> subjects = dto.getSubjectIds().stream()
                    .map(sid -> subjectRepository.findById(sid)
                            .orElseThrow(() -> new ResourceNotFoundException("Subject", sid)))
                    .collect(Collectors.toSet());
            prof.setSubjects(subjects);
        }

        return toDto(professorRepository.save(prof));
    }

    @Transactional
    public ProfessorDto updateProfessor(Long id, ProfessorDto dto) {
        Professor prof = professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor", id));

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));
            prof.setDepartment(dept);
        }
        if (dto.getSpecialization() != null) prof.setSpecialization(dto.getSpecialization());
        if (dto.getMaxHoursPerWeek() != null) prof.setMaxHoursPerWeek(dto.getMaxHoursPerWeek());

        if (dto.getSubjectIds() != null) {
            Set<Subject> subjects = dto.getSubjectIds().stream()
                    .map(sid -> subjectRepository.findById(sid)
                            .orElseThrow(() -> new ResourceNotFoundException("Subject", sid)))
                    .collect(Collectors.toSet());
            prof.setSubjects(subjects);
        }

        return toDto(professorRepository.save(prof));
    }

    @Transactional
    public void deleteProfessor(Long id) {
        if (!professorRepository.existsById(id)) throw new ResourceNotFoundException("Professor", id);
        professorRepository.deleteById(id);
    }

    public List<ProfessorPreferenceDto> getPreferences(Long professorId) {
        if (!professorRepository.existsById(professorId))
            throw new ResourceNotFoundException("Professor", professorId);
        return preferenceRepository.findByProfessorId(professorId).stream()
                .map(this::toPrefDto).toList();
    }

    @Transactional
    public ProfessorPreferenceDto addPreference(Long professorId, Long timeSlotId) {
        Professor prof = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor", professorId));
        TimeSlot slot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", timeSlotId));
        if (preferenceRepository.existsByProfessorIdAndTimeSlotId(professorId, timeSlotId))
            throw new BadRequestException("Preference already exists");
        ProfessorPreference pref = ProfessorPreference.builder()
                .professor(prof).timeSlot(slot).build();
        return toPrefDto(preferenceRepository.save(pref));
    }

    @Transactional
    public void removePreference(Long professorId, Long timeSlotId) {
        preferenceRepository.deleteByProfessorIdAndTimeSlotId(professorId, timeSlotId);
    }

    private ProfessorPreferenceDto toPrefDto(ProfessorPreference pref) {
        return new ProfessorPreferenceDto(
                pref.getId(),
                pref.getProfessor().getId(),
                pref.getTimeSlot().getId(),
                pref.getTimeSlot().getDayOfWeek().name(),
                pref.getTimeSlot().getStartTime().toString(),
                pref.getTimeSlot().getEndTime().toString()
        );
    }

    public ProfessorDto toDto(Professor prof) {
        ProfessorDto dto = new ProfessorDto();
        dto.setId(prof.getId());
        dto.setUserId(prof.getUser().getId());
        dto.setEmail(prof.getUser().getEmail());
        dto.setFirstName(prof.getUser().getFirstName());
        dto.setLastName(prof.getUser().getLastName());
        dto.setDepartmentId(prof.getDepartment().getId());
        dto.setDepartmentName(prof.getDepartment().getName());
        dto.setSpecialization(prof.getSpecialization());
        dto.setMaxHoursPerWeek(prof.getMaxHoursPerWeek());
        if (prof.getSubjects() != null) {
            dto.setSubjectIds(prof.getSubjects().stream().map(Subject::getId).collect(Collectors.toSet()));
            dto.setSubjectNames(prof.getSubjects().stream().map(Subject::getName).collect(Collectors.toSet()));
        }
        return dto;
    }
}
