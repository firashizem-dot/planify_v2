package com.planify.service;

import com.planify.dto.SubjectDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Department;
import com.planify.model.Subject;
import com.planify.repository.DepartmentRepository;
import com.planify.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;

    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<SubjectDto> getSubjectsByDepartment(Long deptId) {
        return subjectRepository.findByDepartmentId(deptId).stream().map(this::toDto).toList();
    }

    public SubjectDto getSubjectById(Long id) {
        return toDto(subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id)));
    }

    @Transactional
    public SubjectDto createSubject(SubjectDto dto) {
        if (subjectRepository.existsByCode(dto.getCode()))
            throw new BadRequestException("Subject code already exists: " + dto.getCode());
        Subject subject = new Subject();
        mapDtoToEntity(dto, subject);
        return toDto(subjectRepository.save(subject));
    }

    @Transactional
    public SubjectDto updateSubject(Long id, SubjectDto dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", id));
        mapDtoToEntity(dto, subject);
        return toDto(subjectRepository.save(subject));
    }

    @Transactional
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) throw new ResourceNotFoundException("Subject", id);
        subjectRepository.deleteById(id);
    }

    private void mapDtoToEntity(SubjectDto dto, Subject subject) {
        subject.setName(dto.getName());
        subject.setCode(dto.getCode());
        subject.setCourseType(dto.getCourseType());
        subject.setHoursPerWeek(dto.getHoursPerWeek());
        subject.setLevel(dto.getLevel());
        subject.setDescription(dto.getDescription());
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));
        subject.setDepartment(dept);
    }

    public SubjectDto toDto(Subject subject) {
        SubjectDto dto = new SubjectDto();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setCode(subject.getCode());
        dto.setCourseType(subject.getCourseType());
        dto.setHoursPerWeek(subject.getHoursPerWeek());
        dto.setLevel(subject.getLevel());
        dto.setDescription(subject.getDescription());
        dto.setDepartmentId(subject.getDepartment().getId());
        dto.setDepartmentName(subject.getDepartment().getName());
        return dto;
    }
}
