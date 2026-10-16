package com.bikexpress.bikexpress.repository;

import com.bikexpress.bikexpress.entities.WishListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListRepo extends JpaRepository<WishListEntity, Integer> {

   List<WishListEntity> findByUser_UserId(Integer userId);

   boolean existsByUser_UserIdAndBike_BikeId(
           Integer userId, Integer bikeId);
}