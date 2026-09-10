package ie.alexos.keepupbackend.score.service;

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
        Score score = new Score();
        score.setPlayerInitials(request.playerInitials());
        score.setScore(request.score());
        return scoreRepository.save(score);
    }

    public List<Score> getTopScores() {
        return scoreRepository.findTop10ByOrderByScoreDesc();
    }
}
