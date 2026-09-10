package ie.alexos.keepupbackend.score.dto;

public record CreateScoreRequest(
        String playerInitials,
        int score
) {
}
