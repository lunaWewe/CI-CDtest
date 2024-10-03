package tw.luna.FinalTest.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tw.luna.FinalTest.dto.OrdersDTO;
import tw.luna.FinalTest.model.OrderDetails;
import tw.luna.FinalTest.model.Orders;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {
	
	Page<Orders> findAll(Pageable pageable);
	
	@Query("SELECT o FROM Orders o JOIN FETCH o.user")
    Page<Orders> findAllWithUser(Pageable pageable);
	
	// 查詢某個時間範圍內的營業額總和 (周、月、年)
    @Query("SELECT SUM(o.finalAmount) FROM Orders o WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate")
    Integer findTotalRevenueWithinPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // 查訂單總額
    @Query("SELECT COUNT(o) FROM Orders o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Integer countOrdersWithinPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // 查詢每日的營業額
    @Query("SELECT new map(FUNCTION('DATE', o.orderDate) AS orderDay, SUM(COALESCE(o.finalAmount, 0)) AS totalRevenue) " +
    	       "FROM Orders o " +
    	       "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
    	       "GROUP BY FUNCTION('DATE', o.orderDate) " +
    	       "ORDER BY orderDay")
    	List<Map<String, Object>> aggregateRevenueByDay(LocalDateTime startDate, LocalDateTime endDate);


    // 查詢每月的營業額
    @Query("SELECT new map(FUNCTION('YEAR', o.orderDate) AS orderYear, FUNCTION('MONTH', o.orderDate) AS orderMonth, SUM(COALESCE(o.finalAmount, 0)) AS totalRevenue) " +
    	       "FROM Orders o " +
    	       "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
    	       "GROUP BY FUNCTION('YEAR', o.orderDate), FUNCTION('MONTH', o.orderDate) " +
    	       "ORDER BY orderYear, orderMonth")
    	List<Map<String, Object>> aggregateRevenueByMonth(LocalDateTime startDate, LocalDateTime endDate);

    
    // 查詢每年的營業額
    @Query("SELECT YEAR(o.orderDate) AS orderYear, SUM(COALESCE(o.finalAmount, 0)) AS totalRevenue " +
    	       "FROM Orders o " +
    	       "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
    	       "GROUP BY YEAR(o.orderDate)")
    	List<Map<String, Object>> aggregateRevenueByYear(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // 抓到order, orderDetails 的column
    @Query(value = "SELECT o.orderId, o.userId, o.cartId, o.couponId, o.orderDate, " +
            "o.totalAmount, o.percentageDiscount, o.amountDiscount, o.finalAmount, " +
            "o.status, o.Address, od.productId, od.quantity, od.price " +
            "FROM orders o " +
            "JOIN orderdetails od ON o.orderId = od.orderId", nativeQuery = true)
    List<Object[]> findOrderDetailsWithJoin();
    
    @Query("SELECT o FROM Orders o WHERE o.orderDate >= :startDate")
    List<Orders> findOrdersAfterDate(@Param("startDate") LocalDateTime startDate);

	List<Orders> findByOrderDateGreaterThanEqual(LocalDateTime startDate);
	
	List<Orders> findByUser_UserId(Long userId);
	Optional<Orders> findByOrderIdAndUser_UserId(Integer orderId, Long userId);
    
	@Query("SELECT new tw.luna.FinalTest.dto.OrdersDTO(o.orderId, o.orderDate, o.address, o.totalAmount, " +
	           "CASE WHEN o.coupon IS NULL THEN null ELSE o.coupon.code END, " +
	           "o.percentageDiscount, o.amountDiscount, o.finalAmount, o.status) " +
	           "FROM Orders o WHERE o.user.userId = :userId")
	    List<OrdersDTO> findOrdersDTOByUserId(@Param("userId") Long userId);
	
//	@Query(value ="SELECT * FROM orders o WHERE o.userId = :userId", nativeQuery = true)
	List<Orders> findByUserUserId(Long userId);
    

}
