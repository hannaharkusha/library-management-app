package com.library.librarysys.controller;

import com.library.librarysys.entity.Order;
import com.library.librarysys.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
     private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/byid/reader")
    public List<Order> getOrders(Long readerID) {
        return orderService.getOrders(readerID);
    }

    @GetMapping("/byid/copy")
    public List<Order> getOrdersByCopy(Long copyID) {
        return orderService.getOrdersByCopyID(copyID);
    }

    @GetMapping("/add")
    public void addOrder(Long readerID, Long copyID) {
        orderService.addOrder(readerID, copyID);
    }

    @GetMapping("/delete")
    public boolean deleteOrder(Long orderID) {
        return orderService.deleteOrderById(orderID);
    }

    @GetMapping("/update")
    public void updateOrderStatus(Long orderID, Order.Status status) {
        orderService.updateOrderStatus(orderID, status);
    }
}
