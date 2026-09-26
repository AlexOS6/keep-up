package ie.alexos.keepupbackend.score.service;

import ie.alexos.keepupbackend.exception.ScoreDoesNotQualifyException;
import ie.alexos.keepupbackend.score.dto.CreateScoreRequest;
import ie.alexos.keepupbackend.score.model.Score;
import ie.alexos.keepupbackend.score.repository.ScoreRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ScoreServiceTest {

    @Mock
    private ScoreRepository scoreRepository;

    @InjectMocks
    private ScoreService scoreService;

    @Test
    void givenScore_whenCreateScore_thenSaveScore() {
        CreateScoreRequest request = new CreateScoreRequest("AOS", 1500);
        Score score = new Score();
        score.setPlayerInitials(request.playerInitials());
        score.setScore(request.score());

        when(scoreRepository.save(any(Score.class))).thenReturn(score);

        Score result = scoreService.createScore(request);
        assertEquals("AOS", result.getPlayerInitials());
        assertEquals(1500, result.getScore());

        verify(scoreRepository).save(any(Score.class));
    }

    @Test
    void givenScore_whenGetTopScores_thenReturnTopScoresList() {
        Score score1 = new Score();
        score1.setPlayerInitials("AOS");
        score1.setScore(1500);

        Score score2 = new Score();
        score2.setPlayerInitials("RF");
        score2.setScore(2250);

        List<Score> scores = List.of(score1, score2);
        when(scoreRepository.findTop10ByOrderByScoreDesc()).thenReturn(scores);
        List<Score> result = scoreService.getTopScores();

        assertEquals(2, result.size());
        assertEquals(1500, result.getFirst().getScore());
        assertEquals(2250, result.getLast().getScore());

        verify(scoreRepository).findTop10ByOrderByScoreDesc();
    }

    @Test
    void givenScoreDoesNotQualify_whenCreateScore_thenThrowException() {
        CreateScoreRequest request = new CreateScoreRequest("AOS", 900);

        List<Score> topScores = IntStream.range(0, 10).mapToObj(i -> {
            Score score = new Score();
            score.setScore(1900 - (i * 100));
            return score;
        }).toList();

        when(scoreRepository.findTop10ByOrderByScoreDesc()).thenReturn(topScores);

        assertThrows(ScoreDoesNotQualifyException.class, () -> scoreService.createScore(request));
    }
}
