package com.bikexpress.bikexpress.model.bikeDtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserBikeReqAndRespDto {

    private Integer bikeId;

    @NotBlank
    private String bikeName;

    @NotBlank
    private String model;

    @NotNull
    private  Integer year;

    @NotBlank
    private  String colour;

    @NotNull
    private Double price;

    @NotNull
    private Integer stockQuantity;

    @NotNull
    private  Integer cc;

    @NotNull
    private  Integer mileage;

    @NotBlank
    private  String fuelType;

    @NotBlank
    private  String description;

    private  String image;

}
