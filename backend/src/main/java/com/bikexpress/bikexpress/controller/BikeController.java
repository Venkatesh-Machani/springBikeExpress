package com.bikexpress.bikexpress.controller;

import com.bikexpress.bikexpress.model.bikeDtos.AdminBikeReqAndRespDto;
import com.bikexpress.bikexpress.model.bikeDtos.UserBikeReqAndRespDto;
import com.bikexpress.bikexpress.service.BikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/bikes")
@RequiredArgsConstructor
public class BikeController {

    private final BikeService bikeService;

    @PutMapping("/addBike")
    public ResponseEntity<AdminBikeReqAndRespDto> addBike(@RequestBody AdminBikeReqAndRespDto adminBikeReqAndRespDto){
        AdminBikeReqAndRespDto bikeResponse= bikeService.addBike(adminBikeReqAndRespDto);
        return  new ResponseEntity<>(bikeResponse, HttpStatus.CREATED);
    }

    @GetMapping("/getBike/{model}")
    public ResponseEntity<UserBikeReqAndRespDto> getBike(@PathVariable String model){
        return ResponseEntity.ok(bikeService.getBike(model));
    }

    @GetMapping("/getAllBikes")
    public ResponseEntity<List<UserBikeReqAndRespDto>> getAllBikes(){
        return  ResponseEntity.ok(bikeService.getAllBikes());
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserBikeReqAndRespDto>> searchBikes(@RequestParam(defaultValue = "") String query) {
        return ResponseEntity.ok(bikeService.searchBikes(query));
    }

    @GetMapping("/getBikeForAdmin/{id}")
    public  ResponseEntity<AdminBikeReqAndRespDto> getAllBikesForAdmin(@PathVariable Integer id){
        return ResponseEntity.ok(bikeService.getBikeForAdmin(id));
    }

    @PutMapping("/updateBike")
    public ResponseEntity<AdminBikeReqAndRespDto> updateBike(@RequestBody AdminBikeReqAndRespDto adminBikeReqAndRespDto){
        return ResponseEntity.ok(bikeService.updateBike(adminBikeReqAndRespDto));
    }

    @DeleteMapping("/deleteBike/{bikeModel}")
    public ResponseEntity<Void> deleteBike(@PathVariable String bikeModel){
        bikeService.deleteBike(bikeModel);
        return ResponseEntity.noContent().build();  
    }
}
