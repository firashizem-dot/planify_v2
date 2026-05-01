package com.planify.service;

import com.planify.dto.ProfessorDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.*;
import com.planify.repository.*;
import lombok.RequiredArgsConstructor;
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
        if (professorRepository.existsByUserId(dto.getUserId()))
            throw new BadRequestException("Professor already exists for user: " + dto.getUserId());

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", dto.getUserId()));
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));

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
