package com.bikexpress.bikexpress.model.wishListDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class WishListAddReq {

    private  Integer userId;

    private Integer bikeId;

    private LocalDateTime addedDate;
}
