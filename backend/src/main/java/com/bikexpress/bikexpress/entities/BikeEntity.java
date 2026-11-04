package com.bikexpress.bikexpress.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bikes")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class BikeEntity {

@Column(name = "bike_id")
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer bikeId;

@Column(name = "bike_name")
 private String bikeName;

@Column(name="model")
private String model;

@Column(name ="year")
private Integer year;

@Column(name ="color")
private String colour;

@Column(name ="price",nullable = false)
private Double price;

@Column(name ="stock_quantity")
private  Integer stockQuantity;

@Column(name ="engine_cc")
private Integer cc;

@Column(name="mileage")
private Integer mileage;

@Column(name ="fuel_type")
private String fuelType;

@Column(name ="description")
private String description;

@Column(name ="image")
private String image;

@OneToMany(mappedBy = "bike", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<WishListEntity> wishlist = new ArrayList<>();

@OneToMany(mappedBy = "bike",cascade = CascadeType.ALL)
 private List<OrdersEntity> orders  = new ArrayList<>();

    public BikeEntity(Integer bikeId) {
        this.bikeId = bikeId;
    }
}
