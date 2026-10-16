package com.bikexpress.bikexpress.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import tools.jackson.databind.ser.jdk.TimeZoneSerializer;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "bike_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishListEntity {

@Column(name = "wishlist_id")
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Integer wishlistId;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name="user_id")
private UserEntity user;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "bike_id")
private BikeEntity bike;

@Column(name = "added_date")
private LocalDateTime addedDate;
}
