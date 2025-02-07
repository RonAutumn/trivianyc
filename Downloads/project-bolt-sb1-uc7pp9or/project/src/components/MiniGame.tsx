import React, { useState, useEffect, useCallback } from 'react';
import { type MiniGameState } from '../types/game';

const TRAIN_STEP = 2;
const TRAIN_MOVE_INTERVAL = 50;
const OBSTACLE_STEP = 1;
const OBSTACLE_MOVE_INTERVAL = 50;
const INITIAL_OBSTACLE_SPEED = 0.5;
const OBSTACLE_SPEED_INCREMENT = 0.1;
const OBSTACLE_SPAWN_INTERVAL = 1500;
const GAME_TICK = 100;
const TRAIN_POSITION = 90;
const TRAIN_VERTICAL = 10;
const LEVEL_INTERVAL = 5000;

const GAME_WIDTH = 50;
const GAME_HEIGHT = 60;
const BASE_OBSTACLE_SPEED = 1.2;
const LEVEL_SPEED_INCREMENT = 0.2;
const TICK_MS = 100;
const PLAYER_MOVE_STEP = 10;
const PROGRESS_INCREMENT = 2;

const SCALE = 10;
const WORLD_WIDTH = 120;
const WORLD_HEIGHT = 60;
const GROUND_Y = 55;
const PLAYER_WIDTH = 3;
const PLAYER_HEIGHT = 4;
const PLAYER_START_X = 5;
const PLAYER_START_Y = GROUND_Y - PLAYER_HEIGHT;
const PLAYER_SPEED = 15;
const GRAVITY = 30;
const JUMP_VELOCITY = 12;
const TRAIN_DOOR_WIDTH = 5;
const TRAIN_DOOR_HEIGHT = 4;
const TRAIN_DOOR_X = WORLD_WIDTH - TRAIN_DOOR_WIDTH;
const TRAIN_DOOR_Y = GROUND_Y - TRAIN_DOOR_HEIGHT;
const NUM_OBSTACLES = 6;
const OBSTACLE_WIDTH = 3;
const OBSTACLE_HEIGHT = 3;

interface MiniGameProps {
  type: 'trainline' | 'prize' | 'rush' | 'catchtrain';
  onComplete: (bonusPoints: number) => void;
}

export const MiniGame: React.FC<MiniGameProps> = ({ type, onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  // Time limits for each level
  const timeLimits = {
    1: 20, // Easy - 20 seconds
    2: 15, // Medium - 15 seconds
    3: 10  // Hard - 10 seconds
  };

  const trainlineConfigs = {
    1: { // Easy - 4 train (3 stations)
      stops: ['Woodlawn', 'Mosholu Parkway', 'Bedford Park Blvd'],
      currentOrder: ['Bedford Park Blvd', 'Woodlawn', 'Mosholu Parkway'],
      direction: 'north to south',
      line: '4'
    },
    2: { // Medium - L train (4 stations)
      stops: ['8 Av', '6 Av', '14 St–Union Sq', '3 Av'],
      currentOrder: ['3 Av', '8 Av', '14 St–Union Sq', '6 Av'],
      direction: 'west to east',
      line: 'L'
    },
    3: { // Medium - F train (4 stations)
      stops: ['42 St–Bryant Pk', '34 St–Herald Sq', '23 St', '14 St'],
      currentOrder: ['14 St', '42 St–Bryant Pk', '23 St', '34 St–Herald Sq'],
      direction: 'north to south',
      line: 'F'
    },
    4: { // Hard - A train (5 stations)
      stops: ['125 St', '145 St', '168 St', '175 St', '181 St'],
      currentOrder: ['181 St', '125 St', '168 St', '145 St', '175 St'],
      direction: 'south to north',
      line: 'A'
    },
    5: { // Hard - 2 train (5 stations)
      stops: ['Wakefield–241 St', 'Nereid Av', '233 St', '225 St', '219 St'],
      currentOrder: ['219 St', 'Wakefield–241 St', '233 St', 'Nereid Av', '225 St'],
      direction: 'north to south',
      line: '2'
    },
    6: { // Hard - 1 train (6 stations)
      stops: ['125 St', '137 St–City College', '145 St', '157 St', '168 St', '181 St'],
      currentOrder: ['181 St', '125 St', '157 St', '145 St', '168 St', '137 St–City College'],
      direction: 'south to north',
      line: '1'
    }
  };

  const [timeLeft, setTimeLeft] = useState(timeLimits[1]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<MiniGameState>(() => {
    switch (type) {
      case 'trainline':
        return {
          trainline: {
            ...trainlineConfigs[1],
            selected: null
          }
        };
      case 'prize':
        return {
          prize: {
            boxes: [
              { id: 1, points: Math.floor(Math.random() * 300) + 100 },
              { id: 2, points: Math.floor(Math.random() * 300) + 100 },
              { id: 3, points: Math.floor(Math.random() * 300) + 100 }
            ],
            selected: null
          }
        };
      case 'rush':
        return {
          rush: {
            playerY: 50,
            progress: 0,
            obstacles: [],
            level: 1,
            gameStatus: 'playing' // 'playing', 'win', 'gameover'
          }
        };
      case 'catchtrain':
        return {
          catchtrain: {
            player: {
              x: PLAYER_START_X,
              y: PLAYER_START_Y,
              width: PLAYER_WIDTH,
              height: PLAYER_HEIGHT,
              vy: 0,
              onGround: true
            },
            obstacles: [],
            gameOver: false,
            gameWin: false,
            startTime: null as number | null,
            elapsedTime: 0,
            lastTime: null as number | null
          }
        };
      default:
        return {};
    }
  });

  const handleGameEnd = useCallback(() => {
    if (type === 'trainline') {
      if (currentLevel < 6) {
        // Move to next level
        setCurrentLevel(prev => prev + 1);
        setTimeLeft(timeLimits[currentLevel + 1]);
        setGameState({
          trainline: {
            ...trainlineConfigs[currentLevel + 1],
            selected: null
          }
        });
        setTotalScore(prev => prev + score);
        setScore(0);
      } else {
        // Game complete - all levels finished
        onComplete(totalScore + score);
      }
    } else if (type === 'catchtrain') {
      onComplete(score);
    } else {
      onComplete(score);
    }
  }, [score, onComplete, currentLevel, type, totalScore]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleGameEnd]);

  // Rush game loop effects
  useEffect(() => {
    if (type === 'rush' && gameState.rush && gameState.rush.gameStatus === 'playing') {
      // Spawn new obstacles
      const spawnInterval = setInterval(() => {
        setGameState((prev) => {
          if (!prev.rush) return prev;
          
          const newObstacle = {
            id: Date.now(),
            x: 0,
            y: 5 + Math.random() * 90
          };

          return {
            ...prev,
            rush: {
              ...prev.rush,
              obstacles: [...prev.rush.obstacles, newObstacle]
            }
          };
        });
      }, OBSTACLE_SPAWN_INTERVAL);

      // Main game loop
      const gameTick = setInterval(() => {
        setGameState((prev) => {
          if (!prev.rush) return prev;

          // Update progress
          const newProgress = Math.min(100, prev.rush.progress + PROGRESS_INCREMENT);
          
          // Update level based on progress
          const newLevel = Math.floor(newProgress / 20) + 1;

          // Move obstacles
          const newObstacles = prev.rush.obstacles
            .map((obs) => {
              const speed = BASE_OBSTACLE_SPEED + (prev.rush.level - 1) * LEVEL_SPEED_INCREMENT;
              return { ...obs, x: obs.x + speed };
            })
            .filter((obs) => obs.x < 110);

          // Check for collisions
          const playerX = 5;
          const hasCollision = newObstacles.some(
            (obs) => Math.abs(obs.x - playerX) < 5 && Math.abs(obs.y - prev.rush.playerY) < 10
          );

          if (hasCollision) {
            handleGameEnd();
            return {
              ...prev,
              rush: {
                ...prev.rush,
                gameStatus: 'gameover'
              }
            };
          }

          // Check for win
          if (newProgress >= 100) {
            setScore(1000); // Bonus for winning
            handleGameEnd();
            return {
              ...prev,
              rush: {
                ...prev.rush,
                gameStatus: 'win'
              }
            };
          }

          return {
            ...prev,
            rush: {
              ...prev.rush,
              progress: newProgress,
              level: newLevel,
              obstacles: newObstacles
            }
          };
        });
      }, TICK_MS);

      return () => {
        clearInterval(spawnInterval);
        clearInterval(gameTick);
      };
    }
  }, [type, handleGameEnd]);

  const renderTrainline = () => {
    if (!gameState.trainline) return null;
    const { stops, currentOrder, direction, line } = gameState.trainline;

    const handleDragStart = (e: React.DragEvent, stop: string) => {
      e.dataTransfer.setData('text/plain', stop);
      const element = e.target as HTMLElement;
      element.classList.add('opacity-50');
    };

    const handleDragEnd = (e: React.DragEvent) => {
      const element = e.target as HTMLElement;
      element.classList.remove('opacity-50');
    };

    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
        <div className="text-xl font-bold mb-4">Level {currentLevel}</div>
        <div className="text-lg mb-2">Train Line: {line}</div>
        <div className="text-md mb-4">Arrange stations {direction}</div>
        <div className="text-sm mb-2">Time left: {timeLeft}s</div>
        <div className="grid grid-cols-1 gap-4 w-full">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-sm font-semibold mb-2">Current Order:</div>
            <div className="flex flex-col gap-2">
              {currentOrder.map((stop, index) => (
                <div
                  key={stop}
                  draggable
                  onDragStart={(e) => handleDragStart(e, stop)}
                  onDragEnd={handleDragEnd}
                  className="bg-white p-2 rounded shadow cursor-move hover:bg-blue-50 transition-colors"
                >
                  {stop}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPrize = () => {
    if (!gameState.prize) return null;
    const { boxes, selected } = gameState.prize;

    const handleBoxSelect = (box: { id: number; points: number }) => {
      if (selected) return;
      setGameState(prev => ({
        ...prev,
        prize: { ...prev.prize!, selected: box.id }
      }));
      setScore(box.points);
      setTimeout(handleGameEnd, 1000);
    };

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-subway-yellow">Choose Your Prize!</h3>
        <div className="grid grid-cols-3 gap-4">
          {boxes.map((box) => (
            <button
              key={box.id}
              onClick={() => handleBoxSelect(box)}
              disabled={selected !== null}
              className={`aspect-square p-4 rounded-lg ${
                selected === box.id
                  ? 'bg-subway-yellow text-gray-900'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {selected === box.id ? `+${box.points}` : '?'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderRush = () => {
    if (!gameState.rush) return null;
    const { playerY, progress, obstacles, level, gameStatus } = gameState.rush;

    const handleMove = (direction: 'up' | 'down') => {
      if (gameStatus !== 'playing') return;
      setGameState((prev) => {
        if (!prev.rush) return prev;
        const newY = direction === 'up' ? 
          prev.rush.playerY - PLAYER_MOVE_STEP : 
          prev.rush.playerY + PLAYER_MOVE_STEP;
        return {
          ...prev,
          rush: {
            ...prev.rush,
            playerY: Math.max(0, Math.min(100, newY))
          }
        };
      });
    };

    return (
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-blue-400 text-center">
          42nd St Station Rush
        </h3>
        <p className="text-center">Level: {level} | Progress: {Math.floor(progress)}%</p>
        <div 
          className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-600 mx-auto"
          style={{
            width: `${GAME_WIDTH}vw`,
            height: `${GAME_HEIGHT}vh`
          }}
        >
          {/* Train destination */}
          {gameStatus !== 'gameover' && (
            <div
              className="absolute bg-yellow-500 text-black font-bold flex items-center justify-center"
              style={{
                left: '90%',
                top: 0,
                bottom: 0,
                width: '10%'
              }}
            >
              <div className="text-sm">TRAIN<br/>42 St-Times Sq</div>
            </div>
          )}

          {/* Obstacles */}
          {obstacles.map((obs) => (
            <div
              key={obs.id}
              className="absolute bg-red-500 rounded"
              style={{
                width: '3%',
                height: '5%',
                left: `${obs.x}%`,
                top: `${obs.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Player */}
          {gameStatus === 'playing' && (
            <div
              className="absolute bg-blue-400 rounded-full"
              style={{
                width: '5%',
                height: '8%',
                left: '5%',
                top: `${playerY}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
        </div>

        {gameStatus === 'playing' ? (
          <div className="flex justify-center gap-8">
            <button
              onClick={() => handleMove('up')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded"
            >
              ↑
            </button>
            <button
              onClick={() => handleMove('down')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded"
            >
              ↓
            </button>
          </div>
        ) : (
          <div className="text-center space-y-3">
            {gameStatus === 'win' ? (
              <p className="text-xl font-bold text-green-400">
                You caught the train!
              </p>
            ) : (
              <p className="text-xl font-bold text-red-400">
                Oops! You got stuck in the crowd at 42nd St.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCatchTrain = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState({
      player: {
        x: PLAYER_START_X,
        y: PLAYER_START_Y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        vy: 0,
        onGround: true
      },
      obstacles: [],
      gameOver: false,
      gameWin: false,
      startTime: null as number | null,
      elapsedTime: 0,
      lastTime: null as number | null
    });

    // Initialize canvas and game
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Generate obstacles
      const obstacles = Array.from({ length: NUM_OBSTACLES }, () => ({
        x: 15 + Math.random() * (WORLD_WIDTH - 30),
        y: GROUND_Y - OBSTACLE_HEIGHT,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT
      }));

      setGameState(prev => ({ ...prev, obstacles }));

      const gameLoop = (timestamp: number) => {
        if (gameState.gameOver || gameState.gameWin) return;

        if (!gameState.lastTime) {
          setGameState(prev => ({ ...prev, lastTime: timestamp }));
          requestAnimationFrame(gameLoop);
          return;
        }

        const dt = (timestamp - gameState.lastTime) / 1000;

        // Update player position
        setGameState(prev => {
          const newPlayer = { ...prev.player };
          
          // Horizontal movement
          newPlayer.x += PLAYER_SPEED * dt;
          if (newPlayer.x > WORLD_WIDTH) newPlayer.x = WORLD_WIDTH;

          // Vertical movement
          newPlayer.y += newPlayer.vy * dt;
          newPlayer.vy += GRAVITY * dt;

          // Ground collision
          if (newPlayer.y > PLAYER_START_Y) {
            newPlayer.y = PLAYER_START_Y;
            newPlayer.vy = 0;
            newPlayer.onGround = true;
          } else {
            newPlayer.onGround = false;
          }

          // Check collisions
          const hasCollision = prev.obstacles.some(obstacle => 
            isColliding(newPlayer, obstacle)
          );

          const reachedTrain = isColliding(newPlayer, {
            x: TRAIN_DOOR_X,
            y: TRAIN_DOOR_Y,
            width: TRAIN_DOOR_WIDTH,
            height: TRAIN_DOOR_HEIGHT
          });

          return {
            ...prev,
            player: newPlayer,
            lastTime: timestamp,
            gameOver: hasCollision,
            gameWin: reachedTrain,
            elapsedTime: (timestamp - (prev.startTime || timestamp)) / 1000
          };
        });

        // Draw game
        drawGame(ctx, gameState);
        requestAnimationFrame(gameLoop);
      };

      // Start game loop
      requestAnimationFrame(gameLoop);

      // Handle jump events
      const handleJump = () => {
        if (!gameState.gameOver && !gameState.gameWin && gameState.player.onGround) {
          setGameState(prev => ({
            ...prev,
            player: {
              ...prev.player,
              vy: -JUMP_VELOCITY,
              onGround: false
            }
          }));
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          handleJump();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      canvas.addEventListener('touchstart', handleJump);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        canvas.removeEventListener('touchstart', handleJump);
      };
    }, []);

    // Helper function to check collisions
    const isColliding = (a: any, b: any) => {
      return a.x < b.x + b.width &&
             a.x + a.width > b.x &&
             a.y < b.y + b.height &&
             a.y + a.height > b.y;
    };

    // Draw game function
    const drawGame = (ctx: CanvasRenderingContext2D, state: any) => {
      const { player, obstacles } = state;
      
      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Calculate camera position
      const cameraX = Math.max(0, Math.min(
        player.x - (ctx.canvas.width / SCALE) / 2,
        WORLD_WIDTH - ctx.canvas.width / SCALE
      ));

      // Draw ground
      ctx.fillStyle = "#654321";
      ctx.fillRect(0, GROUND_Y * SCALE, ctx.canvas.width, (WORLD_HEIGHT - GROUND_Y) * SCALE);

      // Draw obstacles
      ctx.fillStyle = "red";
      obstacles.forEach((obstacle: any) => {
        const screenX = (obstacle.x - cameraX) * SCALE;
        ctx.fillRect(
          screenX,
          obstacle.y * SCALE,
          obstacle.width * SCALE,
          obstacle.height * SCALE
        );
      });

      // Draw train door
      ctx.fillStyle = "green";
      const trainScreenX = (TRAIN_DOOR_X - cameraX) * SCALE;
      ctx.fillRect(
        trainScreenX,
        TRAIN_DOOR_Y * SCALE,
        TRAIN_DOOR_WIDTH * SCALE,
        TRAIN_DOOR_HEIGHT * SCALE
      );
      ctx.fillStyle = "black";
      ctx.font = "10px Arial";
      ctx.fillText("TRAIN", trainScreenX, TRAIN_DOOR_Y * SCALE - 5);

      // Draw player
      ctx.fillStyle = "blue";
      const playerScreenX = (player.x - cameraX) * SCALE;
      ctx.fillRect(
        playerScreenX,
        player.y * SCALE,
        player.width * SCALE,
        player.height * SCALE
      );

      // Draw timer
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(`Time: ${state.elapsedTime.toFixed(1)}s`, 10, 20);

      // Draw game over/win overlay
      if (state.gameOver || state.gameWin) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(
          state.gameWin ? "You Made It!" : "Game Over!",
          ctx.canvas.width / 2 - 50,
          ctx.canvas.height / 2
        );
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-bold text-blue-400">Catch the Train!</h3>
        <canvas
          ref={canvasRef}
          width={500}
          height={600}
          className="border-2 border-gray-600 bg-blue-100"
          style={{ touchAction: 'manipulation' }}
        />
        <p className="text-sm text-gray-300">Press SPACE or UP ARROW to jump</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-subway-yellow mb-2">
          {type === 'trainline' && 'Train Line Challenge'}
          {type === 'prize' && 'Mystery Prize'}
          {type === 'rush' && 'Rush Hour'}
          {type === 'catchtrain' && 'Catch the Train'}
        </div>
        <div className="text-xl text-gray-400">
          Time Left: {timeLeft}s
        </div>
      </div>

      {type === 'trainline' && renderTrainline()}
      {type === 'prize' && renderPrize()}
      {type === 'rush' && renderRush()}
      {type === 'catchtrain' && renderCatchTrain()}

      {score > 0 && (
        <div className="text-center mt-4">
          <span className="text-xl font-bold text-subway-yellow">
            +{score} points!
          </span>
        </div>
      )}
    </div>
  );
};