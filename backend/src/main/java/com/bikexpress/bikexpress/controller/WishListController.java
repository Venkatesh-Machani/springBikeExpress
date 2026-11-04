package com.bikexpress.bikexpress.controller;

import com.bikexpress.bikexpress.model.wishListDtos.WishListAddReq;
import com.bikexpress.bikexpress.model.wishListDtos.WishListGetAndDelReqAndRespDto;
import com.bikexpress.bikexpress.service.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/wishList")
@RequiredArgsConstructor
public class WishListController {

    private final WishListService wishListService;

    @PostMapping("/addToWishList/{userId}/{bikeId}")
    public ResponseEntity<Void> addToWishList(@RequestBody WishListAddReq wishListAddReq){
        wishListService.addToWishlist(wishListAddReq);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/getOrdersByUserId/{userId}")
    public ResponseEntity<List<WishListGetAndDelReqAndRespDto>> getWishListByUserId(@PathVariable Integer userId){
        return ResponseEntity.ok(wishListService.getWishlistByUser(userId));
    }

    @GetMapping("/getAllWishlistItems")
    public ResponseEntity<List<WishListGetAndDelReqAndRespDto>> getAllWishList(){
        return ResponseEntity.ok(wishListService.getAllWishList());
    }

    @DeleteMapping("/deleteWishListItem/{wishListId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Integer wishListId){
        wishListService.removeFromWishlist(wishListId);
        return ResponseEntity.noContent().build();
    }
}
