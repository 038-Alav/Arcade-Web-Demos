import { Link } from "react-router-dom";
import "./Home.css";

const games = [
  {
    name: "Snake",
    path: "/snake",
    desc: "El clasico. Probablemente ya lo hayas jugado. No mucho más que decir",
    wip: false,
  },
  {
    name: "Tetris",
    path: "/tetris",
    desc: "Otro clasico. Una build basica pero divertida de Tetris, intenta romper el record!!",
    wip: true,
  },
  {
    name: "Frogger",
    path: "/frogger",
    desc: "Llega hasta el final sin que te atropellen. Debería ser infinito but who cares",
    wip: true,
  },
  {
    name: "Breakout",
    path: "/breakout",
    desc: "Rompe todos los bloques! satisfactorio pero un poco aburrido tbh",
    wip: true,
  },
];

function Home() {
  return (
    <main className="arcade-home">
      <header className="arcade-header">
        <div className="arcade-logo">
          <span>ARCADE</span>
        </div>

        <p className="arcade-subtitle">
          Demo de juegos Clasicos en tu browser.
        </p>
      </header>

      <section className="games-section">
        <div className="section-heading">
          <span className="heading-line" />
          <h1>SELECCION DE JUEGOS</h1>
          <span className="heading-line" />
        </div>

        <div className="games-grid">
          {games.map((game) => (
            <Link
              to={game.path}
              className="game-card"
              key={game.name}
            >
              <div className="game-card-content">
                <h2>{game.name}</h2>
                {game.wip && (
                  <p className="wip-disclaimer">⚠ EN DESARROLLO ⚠ | VUELVE PRONTO</p>
                )}
                <p>{game.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="arcade-footer">
        <p>
          Built with React · JavaScript · CSS
        </p>
      </footer>
    </main>
  );
}

export default Home;