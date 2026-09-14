package ie.alexos.keepupbackend.score.controller;

import ie.alexos.keepupbackend.score.dto.CreateScoreRequest;
import ie.alexos.keepupbackend.score.model.Score;
import ie.alexos.keepupbackend.score.service.ScoreService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scores")
@CrossOrigin(origins = "http://localhost:4200")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping
    public ResponseEntity<Score> createScore(@Valid @RequestBody CreateScoreRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(scoreService.createScore(request));
    }

    @GetMapping
    public ResponseEntity<List<Score>> getTopScores() {
        List<Score> scores = scoreService.getTopScores();
        return ResponseEntity.ok(scores);
    }
}
