package com.bikexpress.bikexpress.controller;

import com.bikexpress.bikexpress.model.OrderDtos.OrderReqAndRespDto;
import com.bikexpress.bikexpress.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/orders")
@RequiredArgsConstructor

public class OrdersController {

    private final OrderService orderService;

    @PostMapping("/addOrder")
    public ResponseEntity<Void> addOrder(@RequestBody OrderReqAndRespDto orderReqAndRespDto, HttpServletRequest request){
        HttpSession session = request.getSession(false);
        if (session != null && "USER".equals(session.getAttribute("BIKEXPRESS_ROLE"))
                && !session.getAttribute("BIKEXPRESS_USER_ID").equals(orderReqAndRespDto.getUserId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        orderService.addOrder(orderReqAndRespDto);
        return  new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/getOrdersByUserId/{userId}")
    public ResponseEntity<List<OrderReqAndRespDto>> getOrders(@PathVariable Integer userId, HttpServletRequest request){
        HttpSession session = request.getSession(false);
        if (session != null && "USER".equals(session.getAttribute("BIKEXPRESS_ROLE"))
                && !java.util.Objects.equals(session.getAttribute("BIKEXPRESS_USER_ID"), userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(orderService.getAllOrderByUserId(userId));
    }

    @GetMapping("/getOrderByOrderId/{orderId}")
    public  ResponseEntity<OrderReqAndRespDto> getOrderByOrderId(@PathVariable Integer orderId){
        return ResponseEntity.ok(orderService.getOrderByOrderId(orderId));
    }

    @GetMapping("/getAllOrders")
    public ResponseEntity<List<OrderReqAndRespDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PatchMapping("/updateOrder")
    public  ResponseEntity<OrderReqAndRespDto> updateOrder(@RequestBody OrderReqAndRespDto orderReqAndRespDto){
        return  ResponseEntity.ok(orderService.updateOrder(orderReqAndRespDto));
    }

    @DeleteMapping("/deleteOrder/{orderId}")
    public ResponseEntity<Map<String ,String>> deleteOrder(@PathVariable Integer orderId){
        orderService.deleteOrderByOrderId(orderId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order Deleted Successfully");
        return  ResponseEntity.ok(response);
    }
}
