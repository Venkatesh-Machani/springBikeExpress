package com.bikexpress.bikexpress.entities;

import com.bikexpress.bikexpress.enumeration.OrderStatus;
import com.bikexpress.bikexpress.enumeration.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrdersEntity {

@Column(name = "order_id")
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer orderId;

@ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
@JoinColumn(name = "user_id", nullable = false)
private UserEntity user;

@ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
@JoinColumn(name = "bike_id", nullable = false)
private BikeEntity bike;

@Column(name = "order_date")
private LocalDateTime orderDate;

@Enumerated(EnumType.STRING)
@Column(name ="order_status")
private OrderStatus orderStatus;

@Column(name="payment_status")
private PaymentStatus paymentStatus;

@Column(name = "shipping_address")
private String shippingAddress;

}
