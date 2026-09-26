package ie.alexos.keepupbackend.score.service;

import ie.alexos.keepupbackend.exception.ScoreDoesNotQualifyException;
import ie.alexos.keepupbackend.score.dto.CreateScoreRequest;
import ie.alexos.keepupbackend.score.model.Score;
import ie.alexos.keepupbackend.score.repository.ScoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;

    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    public Score createScore(CreateScoreRequest request) {

        if (!qualifiesForTop10(request.score())) {
            throw new ScoreDoesNotQualifyException();
        }

        Score score = new Score();
        score.setPlayerInitials(request.playerInitials());
        score.setScore(request.score());
        return scoreRepository.save(score);
    }

    public List<Score> getTopScores() {
        return scoreRepository.findTop10ByOrderByScoreDesc();
    }

    public boolean qualifiesForTop10(int score) {
        List<Score> topScores = scoreRepository.findTop10ByOrderByScoreDesc();

        if (topScores.size() < 10) {
            return true;
        }

        Score lowestTopScore = topScores.getLast();
        return score > lowestTopScore.getScore();
    }
}
