package ie.alexos.keepupbackend.exception;

public class ScoreDoesNotQualifyException extends RuntimeException {
    public ScoreDoesNotQualifyException() {
        super("Score does not qualify for the Top 10 leaderboard");
    }
}
