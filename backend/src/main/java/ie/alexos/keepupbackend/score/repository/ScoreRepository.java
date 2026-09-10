package ie.alexos.keepupbackend.score.repository;

import ie.alexos.keepupbackend.score.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findTop10ByOrderByScoreDesc();
}
