package com.planify.repository;

import com.planify.model.User;
import com.planify.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByDepartmentId(Long departmentId);
    List<User> findByRoleAndDepartmentId(UserRole role, Long departmentId);
}
