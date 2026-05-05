package com.planify.service;

import com.planify.dto.StudentGroupDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Department;
import com.planify.model.StudentGroup;
import com.planify.repository.DepartmentRepository;
import com.planify.repository.StudentGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentGroupService {

    private final StudentGroupRepository groupRepository;
    private final DepartmentRepository departmentRepository;

    public List<StudentGroupDto> getAllGroups() {
        return groupRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<StudentGroupDto> getGroupsByDepartment(Long deptId) {
        return groupRepository.findByDepartmentId(deptId).stream().map(this::toDto).toList();
    }

    public StudentGroupDto getGroupById(Long id) {
        return toDto(groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudentGroup", id)));
    }

    @Transactional
    public StudentGroupDto createGroup(StudentGroupDto dto) {
        if (groupRepository.existsByCode(dto.getCode()))
            throw new BadRequestException("Group code already exists: " + dto.getCode());
        StudentGroup group = new StudentGroup();
        mapDtoToEntity(dto, group);
        return toDto(groupRepository.save(group));
    }

    @Transactional
    public StudentGroupDto updateGroup(Long id, StudentGroupDto dto) {
        StudentGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudentGroup", id));
        mapDtoToEntity(dto, group);
        return toDto(groupRepository.save(group));
    }

    @Transactional
    public void deleteGroup(Long id) {
        if (!groupRepository.existsById(id)) throw new ResourceNotFoundException("StudentGroup", id);
        groupRepository.deleteById(id);
    }

    private void mapDtoToEntity(StudentGroupDto dto, StudentGroup group) {
        group.setName(dto.getName());
        group.setCode(dto.getCode());
        group.setLevel(dto.getLevel());
        // studentCount is managed by StudentService based on enrolled students — don't override here
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));
        group.setDepartment(dept);
    }

    public StudentGroupDto toDto(StudentGroup group) {
        StudentGroupDto dto = new StudentGroupDto();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setCode(group.getCode());
        dto.setLevel(group.getLevel());
        dto.setStudentCount(group.getStudentCount());
        dto.setDepartmentId(group.getDepartment().getId());
        dto.setDepartmentName(group.getDepartment().getName());
        return dto;
    }
}
