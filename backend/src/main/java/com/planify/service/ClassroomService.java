package com.planify.service;

import com.planify.dto.ClassroomDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Classroom;
import com.planify.model.Department;
import com.planify.repository.ClassroomRepository;
import com.planify.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final DepartmentRepository departmentRepository;

    public List<ClassroomDto> getAllClassrooms() {
        return classroomRepository.findAll().stream().map(this::toDto).toList();
    }

    public ClassroomDto getClassroomById(Long id) {
        return toDto(classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom", id)));
    }

    @Transactional
    public ClassroomDto createClassroom(ClassroomDto dto) {
        if (classroomRepository.existsByCode(dto.getCode()))
            throw new BadRequestException("Classroom code already exists: " + dto.getCode());
        Classroom classroom = new Classroom();
        mapDtoToEntity(dto, classroom);
        return toDto(classroomRepository.save(classroom));
    }

    @Transactional
    public ClassroomDto updateClassroom(Long id, ClassroomDto dto) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom", id));
        mapDtoToEntity(dto, classroom);
        return toDto(classroomRepository.save(classroom));
    }

    @Transactional
    public void deleteClassroom(Long id) {
        if (!classroomRepository.existsById(id)) throw new ResourceNotFoundException("Classroom", id);
        classroomRepository.deleteById(id);
    }

    private void mapDtoToEntity(ClassroomDto dto, Classroom classroom) {
        classroom.setName(dto.getName());
        classroom.setCode(dto.getCode());
        classroom.setType(dto.getType());
        classroom.setCapacity(dto.getCapacity());
        classroom.setEquipment(dto.getEquipment());
        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));
            classroom.setDepartment(dept);
        }
    }

    public ClassroomDto toDto(Classroom classroom) {
        ClassroomDto dto = new ClassroomDto();
        dto.setId(classroom.getId());
        dto.setName(classroom.getName());
        dto.setCode(classroom.getCode());
        dto.setType(classroom.getType());
        dto.setCapacity(classroom.getCapacity());
        dto.setEquipment(classroom.getEquipment());
        if (classroom.getDepartment() != null) {
            dto.setDepartmentId(classroom.getDepartment().getId());
            dto.setDepartmentName(classroom.getDepartment().getName());
        }
        return dto;
    }
}
