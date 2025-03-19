package ru.berezhnov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.berezhnov.models.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    @Query("from Order where status like 'deleted'")
    List<Order> findAllDeleted();

    @Query("from Order where status not like 'deleted'")
    List<Order> findAllUndeleted();

    @Query("from Order o inner join o.user u where u.email = :email")
    List<Order> findAllByUserEmail(@Param("email") String userEmail);
}
