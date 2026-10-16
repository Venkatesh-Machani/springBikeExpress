package com.bikexpress.bikexpress.service;

import com.bikexpress.bikexpress.model.wishListDtos.WishListAddReq;
import com.bikexpress.bikexpress.model.wishListDtos.WishListGetAndDelReqAndRespDto;

import java.util.List;

public interface WishListService {

    void addToWishlist(WishListAddReq wishListAddReq);

    void removeFromWishlist(Integer orderId);

    List<WishListGetAndDelReqAndRespDto> getWishlistByUser(Integer userId);

    boolean isBikeInWishlist(Integer userId, Integer bikeId);

    List<WishListGetAndDelReqAndRespDto> getAllWishList();
}

