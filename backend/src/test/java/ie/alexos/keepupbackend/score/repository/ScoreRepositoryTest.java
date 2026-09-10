package ie.alexos.keepupbackend.score.repository;

import ie.alexos.keepupbackend.score.model.Score;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
public class ScoreRepositoryTest {

    @Autowired
    private ScoreRepository scoreRepository;

    @Test
    void shouldReturnTop10ScoresInDescendingOrder() {
        scoreRepository.saveAll(List.of(
                createScore("AA", 100),
                createScore("BB", 200),
                createScore("CC", 300),
                createScore("DD", 400),
                createScore("EE", 500),
                createScore("FF", 600),
                createScore("GG", 700),
                createScore("HH", 800),
                createScore("II", 900),
                createScore("JJ", 1000),
                createScore("KK", 1100),
                createScore("LL", 1200)
        ));

        List<Score> result = scoreRepository.findTop10ByOrderByScoreDesc();

        assertEquals(10, result.size());
        assertEquals(1200, result.getFirst().getScore());
        assertEquals(1100, result.get(1).getScore());
        assertEquals(300, result.getLast().getScore());
    }

    private Score createScore(String initials, int scoreVal) {
        Score score = new Score();
        score.setPlayerInitials(initials);
        score.setScore(scoreVal);
        return score;
    }
}
