package com.bikexpress.bikexpress.model.OrderDtos;

import com.bikexpress.bikexpress.enumeration.OrderStatus;
import com.bikexpress.bikexpress.enumeration.PaymentStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Builder
public class OrderReqAndRespDto {

    private  Integer orderId;
    
    private  Integer userId;

    private  Integer bikeId;

    private LocalDateTime orderDate;

    private OrderStatus orderStatus;

    private PaymentStatus paymentStatus;

    private  String shippingAddress;

}
