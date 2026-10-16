package com.bikexpress.bikexpress.repository;

import com.bikexpress.bikexpress.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserEntity, Integer> {

    boolean existsByEmail(String email);

    Optional<UserEntity> findByEmail(String email);
}
