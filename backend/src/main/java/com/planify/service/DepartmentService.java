package com.planify.service;

import com.planify.dto.DepartmentDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Department;
import com.planify.model.User;
import com.planify.repository.DepartmentRepository;
import com.planify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream().map(this::toDto).toList();
    }

    public DepartmentDto getDepartmentById(Long id) {
        return toDto(departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id)));
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.existsByCode(dto.getCode()))
            throw new BadRequestException("Department code already exists: " + dto.getCode());
        if (departmentRepository.existsByName(dto.getName()))
            throw new BadRequestException("Department name already exists: " + dto.getName());

        Department dept = new Department();
        mapDtoToEntity(dto, dept);
        return toDto(departmentRepository.save(dept));
    }

    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
        mapDtoToEntity(dto, dept);
        return toDto(departmentRepository.save(dept));
    }

    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) throw new ResourceNotFoundException("Department", id);
        departmentRepository.deleteById(id);
    }

    private void mapDtoToEntity(DepartmentDto dto, Department dept) {
        dept.setName(dto.getName());
        dept.setCode(dto.getCode());
        dept.setDescription(dto.getDescription());
        if (dto.getHeadId() != null) {
            User head = userRepository.findById(dto.getHeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", dto.getHeadId()));
            dept.setHead(head);
        }
    }

    public DepartmentDto toDto(Department dept) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(dept.getId());
        dto.setName(dept.getName());
        dto.setCode(dept.getCode());
        dto.setDescription(dept.getDescription());
        if (dept.getHead() != null) {
            dto.setHeadId(dept.getHead().getId());
            dto.setHeadName(dept.getHead().getFullName());
        }
        return dto;
    }
}
