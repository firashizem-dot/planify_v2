package com.planify.service;

import com.planify.dto.UserDto;
import com.planify.exception.BadRequestException;
import com.planify.exception.ResourceNotFoundException;
import com.planify.model.Department;
import com.planify.model.User;
import com.planify.model.enums.UserRole;
import com.planify.repository.DepartmentRepository;
import com.planify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<UserDto> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream().map(this::toDto).toList();
    }

    public UserDto getUserById(Long id) {
        return toDto(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id)));
    }

    public UserDto getUserByEmail(String email) {
        return toDto(userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email)));
    }

    @Transactional
    public UserDto createUser(UserDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already in use: " + dto.getEmail());
        }
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }
        User user = new User();
        mapDtoToEntity(dto, user);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return toDto(userRepository.save(user));
    }

    @Transactional
    public UserDto updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        mapDtoToEntity(dto, user);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return toDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("User", id);
        userRepository.deleteById(id);
    }

    private void mapDtoToEntity(UserDto dto, User user) {
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setRole(dto.getRole());
        user.setEnabled(dto.isEnabled());
        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));
            user.setDepartment(dept);
        }
    }

    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        dto.setEnabled(user.isEnabled());
        dto.setTwoFactorEnabled(user.isTwoFactorEnabled());
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
        }
        return dto;
    }
}
