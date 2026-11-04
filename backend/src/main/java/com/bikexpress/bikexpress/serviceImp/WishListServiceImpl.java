package com.bikexpress.bikexpress.serviceImp;

import com.bikexpress.bikexpress.entities.BikeEntity;
import com.bikexpress.bikexpress.entities.UserEntity;
import com.bikexpress.bikexpress.entities.WishListEntity;
import com.bikexpress.bikexpress.exceptions.NotFoundException;
import com.bikexpress.bikexpress.mappers.WishListMapper;
import com.bikexpress.bikexpress.model.wishListDtos.WishListAddReq;
import com.bikexpress.bikexpress.model.wishListDtos.WishListGetAndDelReqAndRespDto;
import com.bikexpress.bikexpress.repository.BikeRepo;
import com.bikexpress.bikexpress.repository.UserRepo;
import com.bikexpress.bikexpress.repository.WishListRepo;
import com.bikexpress.bikexpress.service.WishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishListServiceImpl implements WishListService {

    private final UserRepo userRepository;
    private final BikeRepo bikeRepository;
    private final WishListRepo wishListRepo;

    // Add a bike to the user's wishlist
    @Override
    public void addToWishlist(WishListAddReq wishListAddReq) {

        // 1. Find the user
        UserEntity user = userRepository.findById(wishListAddReq.getUserId()).orElseThrow(() ->
                        new NotFoundException("User not found with ID: " + wishListAddReq.getUserId()));

        // 2. Find the bike
        BikeEntity bike = bikeRepository.findById(wishListAddReq.getBikeId())
                .orElseThrow(() -> new NotFoundException("Bike not found with ID: " + wishListAddReq.getBikeId()));

        // 3. Prevent duplicate wishlist entries
        boolean alreadyExists =
                wishListRepo.existsByUser_UserIdAndBike_BikeId(user.getUserId(), bike.getBikeId());

        if (alreadyExists) {
            throw new IllegalStateException(
                    "Bike is already in your wishlist");
        }

        // 4. Create the wishlist entity
        WishListEntity wishlist = new WishListEntity();
        wishlist.setUser(user);
        wishlist.setBike(bike);

        // 5. Save the entity
        WishListEntity savedWishlist = wishListRepo.save(wishlist);
    }

    // Remove a bike from the user's wishlist
    @Override
    public void removeFromWishlist(Integer orderId) {

        boolean exists =
                wishListRepo.existsById(orderId);

        if (!exists) {
            throw new NotFoundException("Bike not found in wishlist");
        }
        wishListRepo.deleteById(orderId);
    }

    // Get all wishlist bikes for a particular user
    @Override
    @Transactional(readOnly = true)
    public List<WishListGetAndDelReqAndRespDto> getWishlistByUser(Integer userId) {

        if (!userRepository.existsById(userId)) {
            throw new NotFoundException(
                    "User not found with ID: " + userId);
        }

        List<WishListEntity> wishlistItems =
                wishListRepo.findByUser_UserId(userId);

        return wishlistItems.stream()
                .map(WishListMapper::toWishListResp)
                .toList();
    }

    // Check whether a bike is already in the wishlist
    @Override
    @Transactional(readOnly = true)
    public boolean isBikeInWishlist(Integer userId, Integer bikeId) {

        return wishListRepo.existsByUser_UserIdAndBike_BikeId(userId, bikeId);
    }

    @Override
    public List<WishListGetAndDelReqAndRespDto> getAllWishList() {
        List<WishListEntity> wishListItems = wishListRepo.findAll();
        return wishListItems.stream()
                .map(WishListMapper::toWishListResp)
                .toList();
    }
}