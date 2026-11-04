package com.bikexpress.bikexpress.service;

import com.bikexpress.bikexpress.model.OrderDtos.OrderReqAndRespDto;

import java.util.List;

public interface OrderService {

    public void addOrder(OrderReqAndRespDto orderReqAndRespDto);

    public OrderReqAndRespDto getOrderByOrderId(Integer id);

    public List<OrderReqAndRespDto> getAllOrderByUserId(Integer id);

    public  List<OrderReqAndRespDto> getAllOrders();

    public OrderReqAndRespDto updateOrder(OrderReqAndRespDto orderReqAndRespDto);

    public void deleteOrderByOrderId(Integer id);
}
