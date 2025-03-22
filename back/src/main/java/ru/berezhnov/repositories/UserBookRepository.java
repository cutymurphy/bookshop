package ru.berezhnov.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.berezhnov.models.UserBook;
import ru.berezhnov.models.UserBookKey;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserBookRepository extends JpaRepository<UserBook, UserBookKey> {
    @Query("from UserBook where id.userId = :idUser and id.bookId = :idBook")
    Optional<UserBook> findByUserIdAndBookId(@Param("idUser") UUID idUser, @Param("idBook") UUID idBook);

    @Query("from UserBook where id.userId = :idUser")
    List<UserBook> findAllByUserId(@Param("idUser") UUID id);

    @Modifying
    @Query("delete from UserBook where id.userId = :idUser")
    void deleteByUserId(@Param("idUser") UUID id);
}
