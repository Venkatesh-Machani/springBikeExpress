package com.bikexpress.bikexpress.repository;

import com.bikexpress.bikexpress.entities.BikeEntity;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BikeRepo extends JpaRepository<BikeEntity,Integer> {


    boolean existsByModel(@NotBlank String bikeModel);

    BikeEntity findByModel(String model);

    java.util.List<BikeEntity> findByBikeNameContainingIgnoreCaseOrModelContainingIgnoreCase(String bikeName, String model);

    void deleteByModel(String bikeModel);
}
