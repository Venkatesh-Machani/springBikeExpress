package com.bikexpress.bikexpress.serviceImp;

import com.bikexpress.bikexpress.entities.BikeEntity;
import com.bikexpress.bikexpress.exceptions.NotFoundException;
import com.bikexpress.bikexpress.mappers.BikeMapper;
import com.bikexpress.bikexpress.model.bikeDtos.AdminBikeReqAndRespDto;
import com.bikexpress.bikexpress.model.bikeDtos.UserBikeReqAndRespDto;
import com.bikexpress.bikexpress.repository.BikeRepo;
import com.bikexpress.bikexpress.service.BikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.lang.reflect.Field;

@Service
@RequiredArgsConstructor
public class BikeServiceImpl implements BikeService {

    private final BikeRepo bikeRepo;

    @Override
    public AdminBikeReqAndRespDto addBike(AdminBikeReqAndRespDto adminBikeReqAndRespDto) {
      if(bikeRepo.existsByModel(adminBikeReqAndRespDto.getModel())){
          throw new NotFoundException("Bike Already Exist");
      }
        BikeEntity bikeEntity = bikeRepo.save(BikeMapper.toBikeEntity(adminBikeReqAndRespDto));
        return BikeMapper.toAdminResponse(bikeEntity);
    }

    @Override
    public UserBikeReqAndRespDto getBike(String model) {
        boolean bikeExists = bikeRepo.existsByModel(model);
        if(!bikeExists){
            throw new NotFoundException("Bike Not Found");
        }
        return BikeMapper.toUserResponse(bikeRepo.findByModel(model));
    }

    private BikeEntity getBikeEntity(Integer id) {
        return bikeRepo.findById(id).orElseThrow(()-> new NotFoundException("Bike Not Found"));
    }

    @Override
    public List<UserBikeReqAndRespDto> getAllBikes() {
        return bikeRepo.findAll().stream()
                .map(BikeMapper::toUserResponse)
                .toList();
    }

    @Override
    public AdminBikeReqAndRespDto getBikeForAdmin(Integer bikeId) {
        return BikeMapper.toAdminResponse(bikeRepo.findById(bikeId).orElseThrow(()->new NotFoundException("Bike Not Found")));
    }


    @Override
    public AdminBikeReqAndRespDto updateBike(AdminBikeReqAndRespDto dto) {
        // 1. Fetch the existing bike entity
        BikeEntity existBike = bikeRepo.findById(dto.getBikeId())
                .orElseThrow(() -> new NotFoundException("Bike Not Found"));

        // 2. Dynamically copy fields from DTO to Entity using Reflection
        List<Field> fieldsList = new ArrayList<>();
        Class<?> currentClass = dto.getClass();
        Field[] currentFields = new Field[]{};
        while (currentClass.getDeclaredFields().length > 0){
            currentFields = currentClass.getDeclaredFields();
            fieldsList.addAll(Arrays.asList(currentFields));
            currentClass = currentClass.getSuperclass();
        }
        Field[] dtoFields = new Field[fieldsList.size()];
        for (int i = 0; i < fieldsList.size(); i++) {
            dtoFields[i] = fieldsList.get(i);
        }

        for (Field dtoField : dtoFields) {
            try {
                // Allow access to private fields
                dtoField.setAccessible(true);
                Object value = dtoField.get(dto);

                // Skip updating the ID field and any null values
                if (dtoField.getName().equals("bikeId") || value == null) {
                    continue;
                }

                // Map DTO field names to matching Entity field names (handles custom mapping if needed)
                String entityFieldName = dtoField.getName();


                // Find the matching field in the Entity class
                Field entityField = existBike.getClass().getDeclaredField(entityFieldName);
                entityField.setAccessible(true);

                // Set the new value onto the existing bike entity
                entityField.set(existBike, value);

            } catch (NoSuchFieldException e) {
                // Log or ignore fields that exist in DTO but not in Entity
                System.out.println("Field " + dtoField.getName() + " not found in Entity. Skipping.");
            } catch (IllegalAccessException e) {
                throw new RuntimeException("Failed to update field via reflection", e);
            }
        }

        // 3. Save and return
        BikeEntity savedBike = bikeRepo.save(existBike);
        return BikeMapper.toAdminResponse(savedBike);
    }

    @Override
    public void deleteBike(String bikeModel) {
       if(bikeRepo.existsByModel(bikeModel)){
           bikeRepo.deleteByModel(bikeModel);
       }
       else {
           throw new NotFoundException("Bike Not Found");
       }
    }
}
