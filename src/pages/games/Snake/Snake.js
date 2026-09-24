import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Snake.css";
import sonidoComer from "./sonidos/comer.wav";
import sonidoMorir from "./sonidos/morir.wav";

const sounds = {
  eat: new Audio(sonidoComer),
  gameover: new Audio(sonidoMorir),
};

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const INITIAL_DIRECTION = { x: 1, y: 0 };

const playSound = (sound) => {
  sound.currentTime = 0;
  sound.play().catch(() => {});
};

function getRandomFood(snake) {
  const available = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const occupied = snake.some(
        (segment) => segment.x === x && segment.y === y
      );

      if (!occupied) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) {
    return null;
  }

  return available[Math.floor(Math.random() * available.length)];
}

function Snake() {
  const canvasRef = useRef(null);

  const snakeRef = useRef(INITIAL_SNAKE);
  const directionRef = useRef(INITIAL_DIRECTION);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [food, setFood] = useState(() =>
    getRandomFood(INITIAL_SNAKE)
  );

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid
    ctx.strokeStyle = "#1f1f1f";
    ctx.lineWidth = 1;

    for (let x = 0; x <= GRID_SIZE; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
    }

    for (let y = 0; y <= GRID_SIZE; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }

    // Food
    if (food) {
      ctx.fillStyle = "#ef4444";

      ctx.fillRect(
        food.x * CELL_SIZE + 2,
        food.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
    }

    // Snake
    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#a78bfa" : "#7c3aed";

      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });
  }, [food]);

  const resetGame = useCallback(() => {
    snakeRef.current = INITIAL_SNAKE;
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;

    setScore(0);
    setGameOver(false);
    setPaused(false);
    setFood(getRandomFood(INITIAL_SNAKE));
  }, []);

  const changeDirection = useCallback((newDirection) => {
    const current = directionRef.current;

    // Prevent reversing directly into yourself
    if (
      newDirection.x === -current.x &&
      newDirection.y === -current.y
    ) {
      return;
    }

    nextDirectionRef.current = newDirection;
  }, []);

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(event) {
      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        W: { x: 0, y: -1 },

        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        S: { x: 0, y: 1 },

        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        A: { x: -1, y: 0 },

        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
        D: { x: 1, y: 0 },
      };

      if (keyMap[event.key]) {
        event.preventDefault();
        changeDirection(keyMap[event.key]);
      }

      if (event.key === " ") {
        event.preventDefault();

        if (!gameOver) {
          setPaused((current) => !current);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [changeDirection, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver || paused) {
      drawGame();
      return;
    }

    const interval = setInterval(() => {
      directionRef.current = nextDirectionRef.current;

      const direction = directionRef.current;
      const currentSnake = snakeRef.current;

      const head = currentSnake[0];

      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        playSound(sounds.gameover);
        return;
      }

      // Self collision
      const hitSelf = currentSnake.some(
        (segment) =>
          segment.x === newHead.x &&
          segment.y === newHead.y
      );

      if (hitSelf) {
        setGameOver(true);
        playSound(sounds.gameover);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      // Food collision
      const ateFood =
        food &&
        newHead.x === food.x &&
        newHead.y === food.y;

      if (ateFood) {
        setScore((current) => current + 1);
        playSound(sounds.eat);

        setFood(getRandomFood(newSnake));
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;

      drawGame();
    }, 120);

    return () => clearInterval(interval);
  }, [food, gameOver, paused, drawGame]);

  // Redraw when state changes
  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <main className="snake-page">
      <header className="snake-header">
        <Link to="/" className="back-button">
          ← Arcade
        </Link>

        <h1>SNAKE</h1>

        <div className="score">
          SCORE: <strong>{score}</strong>
        </div>
      </header>

      <section className="snake-game">
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            aria-label="Snake game board"
          />

          {gameOver && (
            <div className="game-overlay">
              <h2>GAME OVER</h2>
              <p>Puntaje: {score}</p>

              <button onClick={resetGame}>
                JUGAR OTRA VEZ
              </button>
            </div>
          )}

          {paused && !gameOver && (
            <div className="game-overlay">
              <h2>PAUSADO</h2>
              <p>SPACE para continuar</p>
            </div>
          )}
        </div>

        <div className="snake-controls">
          <p>
            <strong>Controles</strong>
          </p>

          <p>
            Flechitas o WASD · Space para pausar.
          </p>

          <button onClick={resetGame}>
            RESTART
          </button>
        </div>
      </section>
    </main>
  );
}

export default Snake;