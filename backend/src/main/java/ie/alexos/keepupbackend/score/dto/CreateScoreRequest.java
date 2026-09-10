package ie.alexos.keepupbackend.score.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

public record CreateScoreRequest(

        @NotBlank(message = "Player initials are required")
        @Pattern(
                regexp = "^[A-Za-z]{2,3}$",
                message = "Players initials must be between 2 or 3 characters"
        )
        String playerInitials,

        @PositiveOrZero(message = "Score cannot be negative")
        int score
) {
}
