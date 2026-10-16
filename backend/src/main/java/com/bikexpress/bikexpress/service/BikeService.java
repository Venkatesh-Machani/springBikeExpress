package com.bikexpress.bikexpress.service;

import com.bikexpress.bikexpress.model.bikeDtos.AdminBikeReqAndRespDto;
import com.bikexpress.bikexpress.model.bikeDtos.UserBikeReqAndRespDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface BikeService {

    public AdminBikeReqAndRespDto addBike(AdminBikeReqAndRespDto adminBikeReqAndRespDto);

    public UserBikeReqAndRespDto getBike(String model);

    public List<UserBikeReqAndRespDto> getAllBikes();

    public AdminBikeReqAndRespDto getBikeForAdmin(Integer id);

    public AdminBikeReqAndRespDto updateBike(AdminBikeReqAndRespDto adminBikeReqAndRespDto);

    public  void deleteBike(String bikeModel);
}
