package tw.luna.FinalTest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tw.luna.FinalTest.model.Pay;

public interface PayRepository extends JpaRepository<Pay, Long> {
}
