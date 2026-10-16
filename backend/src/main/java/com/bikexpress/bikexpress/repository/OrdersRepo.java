package com.bikexpress.bikexpress.repository;

import com.bikexpress.bikexpress.entities.BikeEntity;
import com.bikexpress.bikexpress.entities.OrdersEntity;
import com.bikexpress.bikexpress.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.JpqlQueryBuilder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepo extends JpaRepository<OrdersEntity, Integer> {

    public List<OrdersEntity> findAllByUser(UserEntity user);
}
