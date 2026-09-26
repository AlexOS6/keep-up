package ie.alexos.keepupbackend.score.controller;

import ie.alexos.keepupbackend.exception.ScoreDoesNotQualifyException;
import ie.alexos.keepupbackend.score.dto.CreateScoreRequest;
import ie.alexos.keepupbackend.score.model.Score;
import ie.alexos.keepupbackend.score.service.ScoreService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScoreController.class)
public class ScoreControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ScoreService scoreService;

    @Test
    void givenValidScore_whenCreateScore_thenReturnCreated() throws Exception {
        Score score = new Score();
        score.setPlayerInitials("AOS");
        score.setScore(1500);

        when(scoreService.createScore(any(CreateScoreRequest.class))).thenReturn(score);

        mockMvc.perform(post("/scores")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "playerInitials": "AOS",
                            "score": 1500
                        }
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.playerInitials").value("AOS"))
                .andExpect(jsonPath("$.score").value(1500));
    }

    @Test
    void givenInvalidInitials_whenCreateScore_thenReturnBadRequest() throws Exception {
        mockMvc.perform(post("/scores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "playerInitials": "A1!",
                              "score": 500
                            }
                            """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(scoreService);
    }

    @Test
    void givenNegativeScore_whenCreateScore_thenReturnBadRequest() throws Exception {
        mockMvc.perform(post("/scores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "playerInitials": "AOS",
                              "score": -10
                            }
                            """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(scoreService);
    }

    @Test
    void whenGetTopScores_thenReturnScores() throws Exception {
        Score first = new Score();
        first.setPlayerInitials("AOS");
        first.setScore(1000);

        Score second = new Score();
        second.setPlayerInitials("BOR");
        second.setScore(800);

        when(scoreService.getTopScores())
                .thenReturn(List.of(first, second));

        mockMvc.perform(get("/scores"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].playerInitials").value("AOS"))
                .andExpect(jsonPath("$[0].score").value(1000))
                .andExpect(jsonPath("$[1].playerInitials").value("BOR"))
                .andExpect(jsonPath("$[1].score").value(800));
    }

    @Test
    void givenQualifyingScore_whenCheckQualification_thenReturnTrue() throws Exception {
        when(scoreService.qualifiesForTop10(1200)).thenReturn(true);

        mockMvc.perform(get("/scores/qualifies")
                        .param("score", "1200"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void givenQualifyingScore_whenCheckQualification_thenReturnFalse() throws Exception {
        when(scoreService.qualifiesForTop10(500)).thenReturn(false);

        mockMvc.perform(get("/scores/qualifies")
                        .param("score", "500"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    @Test
    void givenMissingScore_whenCheckQualification_thenReturnBadRequest() throws Exception {
        mockMvc.perform(get("/scores/qualifies"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(scoreService);
    }

    @Test
    void givenNonQualifyingScore_whenCreateScore_thenReturnConflict() throws Exception {
        when(scoreService.createScore(any(CreateScoreRequest.class)))
                .thenThrow(new ScoreDoesNotQualifyException());

        mockMvc.perform(post("/scores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "playerInitials": "AOS",
                                "score": 500
                            }
                            """))
                .andExpect(status().isConflict())
                .andExpect(content().string(
                        "Score does not qualify for the Top 10 leaderboard"
                ));
    }
}
