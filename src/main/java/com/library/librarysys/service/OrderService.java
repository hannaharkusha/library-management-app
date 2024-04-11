package com.library.librarysys.service;

import com.library.librarysys.entity.Copy;
import com.library.librarysys.entity.Order;
import com.library.librarysys.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CopyService copyService;

    @Autowired
    public OrderService(OrderRepository orderRepository, CopyService copyService) {
        this.orderRepository = orderRepository;
        this.copyService = copyService;
    }

    public List<Order> getOrders(Long readerID) {
        try {
            if (readerID == null) {
                throw new IllegalArgumentException("Niepoprawny readerID");
            }
            return orderRepository.findOrdersByReaderId(readerID);
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania zamówień: " + e.getMessage());
            throw e;
        }
    }

    public List<Order> getOrdersByCopyID(Long copyID) {
        try {
            if (copyID == null) {
                throw new IllegalArgumentException("Niepoprawny copyID");
            }
            if(orderRepository.findOrdersByCopyId(copyID) != null) {
                return orderRepository.findOrdersByCopyId(copyID);
            } else {
                return null;
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania zamówień: " + e.getMessage());
            throw e;
        }
    }

    public void addOrder(Long readerID, Long copyID) {
        try {
            if (readerID == null || copyID == null) {
                throw new IllegalArgumentException("Niepoprawne dane.");
            }
            Order order = new Order(readerID, copyID);
            orderRepository.save(order);
            System.out.println("Zamówienie dodane");
            copyService.updateCopyStatus(copyID, Copy.Status.UNAVAILABLE);
        } catch (Exception e) {
            System.err.println("Błąd podczas tworzenia zamówienia: " + e.getMessage());
            throw e;
        }
    }

    public boolean deleteOrderById(Long orderId) {
        try {
            if (orderId == null) {
                throw new IllegalArgumentException("Nieprawidłowy orderID.");
            }
            orderRepository.deleteById(orderId);
            System.out.println("Zamówienie usunięte z bazy danych");
            return true;
        } catch (Exception e) {
            System.err.println("Błąd podczas usuwania zamówienia: " + e.getMessage());
            throw e;
        }
    }

    public void updateOrderStatus(Long orderId, Order.Status status) {
        try {
            if (orderId == null || status == null) {
                throw new IllegalArgumentException("Nieprawidłowy orderID lub status.");
            }
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new EntityNotFoundException("Zamówienie o id " + orderId + " nie znalezione."));
            order.setStatus(status);
            orderRepository.save(order);
            System.out.println("Status zamówienia został zmieniony.");
        } catch (Exception e) {
            System.err.println("Błąd podczas zmieniania statusu zamówienia: " + e.getMessage());
            throw e;
        }
    }
}