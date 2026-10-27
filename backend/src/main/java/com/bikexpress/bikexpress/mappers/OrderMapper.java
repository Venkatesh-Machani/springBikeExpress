package com.bikexpress.bikexpress.mappers;

import com.bikexpress.bikexpress.entities.BikeEntity;
import com.bikexpress.bikexpress.entities.OrdersEntity;
import com.bikexpress.bikexpress.entities.UserEntity;
import com.bikexpress.bikexpress.model.OrderDtos.OrderReqAndRespDto;

import java.time.LocalDateTime;

public class OrderMapper {

    public static OrdersEntity toOrderEntity(OrderReqAndRespDto orderReqAndRespDto){
        return OrdersEntity.builder()
                .orderDate(LocalDateTime.now())
                .orderStatus(orderReqAndRespDto.getOrderStatus())
                .paymentStatus(orderReqAndRespDto.getPaymentStatus())
                .shippingAddress(orderReqAndRespDto.getShippingAddress())
                .totalAmount(orderReqAndRespDto.get)
                .build();
    }

    public static OrderReqAndRespDto toOrderRespDto(OrdersEntity ordersEntity){
        return OrderReqAndRespDto.builder()
                .orderId(ordersEntity.getOrderId())
                .userId(ordersEntity.getUser().getUserId())
                .bikeId(ordersEntity.getBike().getBikeId())
                .orderDate(ordersEntity.getOrderDate())
                .orderStatus(ordersEntity.getOrderStatus())
                .paymentStatus(ordersEntity.getPaymentStatus())
                .shippingAddress(ordersEntity.getShippingAddress())
                .build();
    }
}
