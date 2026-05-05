package com.planify.service;

import com.planify.dto.StudentDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Student;
import com.planify.model.StudentGroup;
import com.planify.model.User;
import com.planify.model.enums.UserRole;
import com.planify.repository.StudentGroupRepository;
import com.planify.repository.StudentRepository;
import com.planify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentGroupRepository groupRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<StudentDto> getStudentsByGroup(Long groupId) {
        return studentRepository.findByStudentGroupId(groupId).stream().map(this::toDto).toList();
    }

    public StudentDto getStudentById(Long id) {
        return toDto(studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id)));
    }

    @Transactional
    public StudentDto createStudent(StudentDto dto) {
        StudentGroup group = groupRepository.findById(dto.getStudentGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("StudentGroup", dto.getStudentGroupId()));

        User user;
        if (dto.getUserId() != null) {
            if (studentRepository.existsByUserId(dto.getUserId()))
                throw new BadRequestException("Student already exists for user: " + dto.getUserId());
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", dto.getUserId()));
        } else {
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
            user.setRole(UserRole.STUDENT);
            user.setEnabled(true);
            user.setDepartment(group.getDepartment());
            user = userRepository.save(user);
        }

        Student student = new Student();
        student.setUser(user);
        student.setStudentGroup(group);
        student = studentRepository.save(student);

        // Update group student count
        updateGroupCount(group);

        return toDto(student);
    }

    @Transactional
    public StudentDto updateStudent(Long id, StudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));

        StudentGroup oldGroup = student.getStudentGroup();

        if (dto.getStudentGroupId() != null && !dto.getStudentGroupId().equals(oldGroup.getId())) {
            StudentGroup newGroup = groupRepository.findById(dto.getStudentGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("StudentGroup", dto.getStudentGroupId()));
            student.setStudentGroup(newGroup);
            student = studentRepository.save(student);
            // Update both old and new group counts
            updateGroupCount(oldGroup);
            updateGroupCount(newGroup);
        } else {
            student = studentRepository.save(student);
        }

        return toDto(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
        StudentGroup group = student.getStudentGroup();
        studentRepository.deleteById(id);
        updateGroupCount(group);
    }

    private void updateGroupCount(StudentGroup group) {
        long count = studentRepository.countByStudentGroupId(group.getId());
        group.setStudentCount((int) count);
        groupRepository.save(group);
    }

    public StudentDto toDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setEmail(student.getUser().getEmail());
        dto.setFirstName(student.getUser().getFirstName());
        dto.setLastName(student.getUser().getLastName());
        dto.setStudentGroupId(student.getStudentGroup().getId());
        dto.setStudentGroupName(student.getStudentGroup().getName());
        dto.setGroupLevel(student.getStudentGroup().getLevel());
        return dto;
    }
}
