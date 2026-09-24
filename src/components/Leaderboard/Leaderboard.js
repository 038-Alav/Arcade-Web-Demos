import { useEffect, useState } from "react";
import { getTopScores } from "../../services/leaderboard";
import "./LeaderboardStyle.css";

function Leaderboard({ game }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadScores() {
      try {
        setLoading(true);
        setError(false);

        const topScores = await getTopScores(game);

        setScores(topScores);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadScores();
  }, [game]);

  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">PUNTAJES</h2>

      {loading && (
        <p className="leaderboard-message">
          Loading...
        </p>
      )}

      {error && (
        <p className="leaderboard-message leaderboard-error">
          Unable to load scores.
        </p>
      )}

      {!loading && !error && scores.length === 0 && (
        <p className="leaderboard-message">
          No scores yet!
        </p>
      )}

      {!loading && !error && scores.length > 0 && (
        <div className="leaderboard-table">
          <div className="leaderboard-header">
            <span>#</span>
            <span>NAME</span>
            <span>SCORE</span>
          </div>

          {scores.map((entry, index) => (
            <div
              className="leaderboard-row"
              key={entry.id}
            >
              <span>{index + 1}</span>

              <span>{entry.initials}</span>

              <span>{entry.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;