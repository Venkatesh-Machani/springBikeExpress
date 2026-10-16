package com.bikexpress.bikexpress.serviceImp;

import com.bikexpress.bikexpress.entities.BikeEntity;
import com.bikexpress.bikexpress.entities.OrdersEntity;
import com.bikexpress.bikexpress.entities.UserEntity;
import com.bikexpress.bikexpress.exceptions.NotFoundException;
import com.bikexpress.bikexpress.mappers.OrderMapper;
import com.bikexpress.bikexpress.model.OrderDtos.OrderReqAndRespDto;
import java.lang.reflect.Field;
import com.bikexpress.bikexpress.repository.BikeRepo;
import com.bikexpress.bikexpress.repository.OrdersRepo;
import com.bikexpress.bikexpress.repository.UserRepo;
import com.bikexpress.bikexpress.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrdersRepo ordersRepo;

    private final UserRepo userRepo;

    private final BikeRepo bikeRepo;

    @Transactional
    @Override
    public void addOrder(OrderReqAndRespDto orderReqAndRespDto) {
      Integer userId = orderReqAndRespDto.getUserId();
        UserEntity userEntity = userRepo.findById(userId).orElseThrow(() -> new NotFoundException("User Not Found"));
        BikeEntity bikeEntity = bikeRepo.findById(orderReqAndRespDto.getBikeId()).orElseThrow(() -> new NotFoundException(("Bike Not Found")));
        OrdersEntity ordersEntity = ordersRepo.save(OrderMapper.toOrderEntity(orderReqAndRespDto));
        bikeEntity.setStockQuantity(bikeEntity.getStockQuantity()-1);
        }


    @Override
    public OrderReqAndRespDto getOrderByOrderId(Integer orderId) {
        OrdersEntity ordersEntity = ordersRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("ORDER NOT FOUND"));
            return  OrderMapper.toOrderRespDto(ordersEntity);
    }

    @Override
    public List<OrderReqAndRespDto> getAllOrderByUserId(Integer id) {
        UserEntity userEntity = userRepo.findById(id).orElseThrow(() -> new NotFoundException("USER NOT FOUND"));
        List<OrdersEntity> allByUser = ordersRepo.findAllByUser(userEntity);
        return allByUser.stream()
                .map(OrderMapper::toOrderRespDto)
                .toList();
    }

    @Override
    public List<OrderReqAndRespDto> getAllOrders() {
        return ordersRepo.findAll().stream()
                .map(OrderMapper::toOrderRespDto)
                .toList();
    }


    @Override
    public OrderReqAndRespDto updateOrder(
            OrderReqAndRespDto orderReqAndRespDto) {

        // 1. Find the existing order
        OrdersEntity ordersEntity = ordersRepo
                .findById(orderReqAndRespDto.getOrderId())
                .orElseThrow(() -> new NotFoundException(
                        "ORDER NOT FOUND with id "
                                + orderReqAndRespDto.getOrderId()));

        // 2. Get all fields from the request DTO
        Field[] fields = OrderReqAndRespDto.class.getDeclaredFields();

        // 3. Iterate through each field
        for (Field field : fields) {
            try {
                field.setAccessible(true);

                // Skip orderId
                if ("orderId".equals(field.getName())) {
                    continue;
                }

                // Get the field value from the request DTO
                Object value = field.get(orderReqAndRespDto);

                // Update only fields supplied with non-null values
                if (value != null) {

                    Field entityField;

                    try {
                        entityField = OrdersEntity.class
                                .getDeclaredField(field.getName());
                    } catch (NoSuchFieldException e) {
                        // The entity does not contain this field
                        continue;
                    }

                    entityField.setAccessible(true);

                    // Ensure field types are compatible
                    if (entityField.getType().isAssignableFrom(
                            field.getType())) {

                        entityField.set(ordersEntity, value);
                    }
                }

            } catch (IllegalAccessException e) {
                throw new NotFoundException(
                        "Failed to update field: " + field.getName());
            }
        }

        // 4. Save the updated entity
        OrdersEntity updatedOrder = ordersRepo.save(ordersEntity);

        // 5. Return the updated order DTO
        return OrderMapper.toOrderRespDto(updatedOrder);
    }

    @Override
    public void deleteOrderByOrderId(Integer orderId) {
        if(ordersRepo.existsById(orderId)){
            ordersRepo.deleteById(orderId);
        }
        else{
            throw new NotFoundException("ORDER NOT FOUND");
        }
    }
}
