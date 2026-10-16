package com.bikexpress.bikexpress.mappers;

import com.bikexpress.bikexpress.entities.BikeEntity;
import com.bikexpress.bikexpress.model.bikeDtos.AdminBikeReqAndRespDto;
import com.bikexpress.bikexpress.model.bikeDtos.UserBikeReqAndRespDto;

public class BikeMapper {

    public static BikeEntity toBikeEntity(AdminBikeReqAndRespDto adminBikeReqAndRespDto){
        return BikeEntity.builder()
                .bikeName(adminBikeReqAndRespDto.getBikeName())
                .model(adminBikeReqAndRespDto.getModel())
                .year(adminBikeReqAndRespDto.getYear())
                .colour(adminBikeReqAndRespDto.getColour())
                .price(adminBikeReqAndRespDto.getPrice())
                .stockQuantity(adminBikeReqAndRespDto.getStockQuantity())
                .cc(adminBikeReqAndRespDto.getCc())
                .mileage(adminBikeReqAndRespDto.getMileage())
                .fuelType(adminBikeReqAndRespDto.getFuelType())
                .description(adminBikeReqAndRespDto.getDescription())
                .image(adminBikeReqAndRespDto.getImage())
                .build();
    }

    public static UserBikeReqAndRespDto toUserResponse(BikeEntity bikeEntity){
        return  UserBikeReqAndRespDto.builder()
                .bikeName(bikeEntity.getBikeName())
                .model(bikeEntity.getModel())
                .year(bikeEntity.getYear())
                .colour(bikeEntity.getColour())
                .price(bikeEntity.getPrice())
                .stockQuantity(bikeEntity.getStockQuantity())
                .cc(bikeEntity.getCc())
                .mileage(bikeEntity.getMileage())
                .fuelType(bikeEntity.getFuelType())
                .description(bikeEntity.getDescription())
                .image(bikeEntity.getImage())
                .build();
    }

    public static AdminBikeReqAndRespDto toAdminResponse(BikeEntity bikeEntity) {
        return AdminBikeReqAndRespDto.builder()
                .bikeId(bikeEntity.getBikeId())
                .bikeName(bikeEntity.getBikeName())
                .model(bikeEntity.getModel())
                .year(bikeEntity.getYear())
                .colour(bikeEntity.getColour())
                .price(bikeEntity.getPrice())
                .stockQuantity(bikeEntity.getStockQuantity())
                .cc(bikeEntity.getCc())
                .mileage(bikeEntity.getMileage())
                .fuelType(bikeEntity.getFuelType())
                .description(bikeEntity.getDescription())
                .image(bikeEntity.getImage())
                .build();
    }
}
