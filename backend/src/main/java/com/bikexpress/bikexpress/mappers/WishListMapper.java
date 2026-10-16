package com.bikexpress.bikexpress.mappers;

import com.bikexpress.bikexpress.entities.BikeEntity;
import com.bikexpress.bikexpress.entities.UserEntity;
import com.bikexpress.bikexpress.entities.WishListEntity;
import com.bikexpress.bikexpress.model.wishListDtos.WishListAddReq;
import com.bikexpress.bikexpress.model.wishListDtos.WishListGetAndDelReqAndRespDto;

import java.time.LocalDateTime;

public class WishListMapper {

    public static WishListGetAndDelReqAndRespDto toWishListResp(WishListEntity wishListEntity){
        return WishListGetAndDelReqAndRespDto.builder()
                .wishListId(wishListEntity.getWishlistId())
                .userId(wishListEntity.getUser().getUserId())
                .bikeId(wishListEntity.getBike().getBikeId())
                .addedDate(LocalDateTime.now())
                .build();
    }

    public static WishListEntity toWishListEntity(WishListAddReq wishListAddReq){
        return WishListEntity.builder()
                .user(new UserEntity(wishListAddReq.getUserId()))
                .bike(new BikeEntity(wishListAddReq.getBikeId())).
                build();
    }
}
