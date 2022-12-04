const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');
const healthEl = document.querySelector('#healthEl');
const pauseScreen = document.querySelector('#pauseScreen');
const returnButton = document.querySelector('#returnButton');
const optionsButton = document.querySelector('#optionsButton');
const easyButton = document.querySelector('#easyButton');
const mediumButton = document.querySelector('#mediumButton');
const hardButton = document.querySelector('#hardButton');

optionsButton.style.display = 'flex';
returnButton.style.display = 'none';
pauseScreen.style.display = 'none';

let bgMusic = new Audio('bgMusic.mp3');
bgMusic.volume = 1;

let gunShot = new Audio('gunShot.mp3');
gunShot.volume = 1;

class Player {
  constructor(x, y, radius, color, health) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.health = health;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
function changeVolume() {
  bgMusic.volume = document.getElementById('volumeSlider').value;
}


function changeSFXVolume() {
  gunShot.volume = document.getElementById('SFXSLider').value;
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class HealthD {
  constructor(x, y, outRadius, inrRadius, outColor, inrColor, velocity) {
    this.x = x;
    this.y = y;
    this.inrRadius = inrRadius;
    this.outRadius = outRadius;
    this.outColor = outColor;
    this.inrColor = inrColor;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.outRadius, 0, Math.PI * 2, false);
    c.fillStyle = this.inrColor;
    c.fill();
    c.beginPath();
    c.arc(this.x, this.y, this.inrRadius, 0, Math.PI * 2, false);
    c.fillStyle = this.outColor;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const friction = 0.975;

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, 'white', 3, 5);
let projectiles = [];
let enemies = [];
let health = [];
let particles = [];

function init() {
  player = new Player(x, y, 10, 'white', 100, 5);
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  health = [];
  scoreEl.innerHTML = score;
  bigScoreEl.innerHTML = score;
  healthEl.innerHTML = player.health;
}

//let spawnTime = 1200
var healthSpawnRate = 15000;
let spawnInterval;
let enemySpawnRate = 1300;

function spawnEnemies() {
  
    spawnInterval = setInterval(() => {
      const radius = Math.random() * (30 - 12) + 12;

      let x;
      let y;

      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      }

      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      enemies.push(new Enemy(x, y, radius, color, velocity));
    }, enemySpawnRate);
  
}

let healthInterval;

function spawnHealth() {
  
    healthInterval = setInterval(() => {
      const outRadius = 20;
      const inrRadius = 12;

      let x;
      let y;

      if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - outRadius : canvas.width + outRadius;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - outRadius : canvas.height + outRadius;
      }

      const outColor = 'rgba(255, 255, 255, 1)';
      const inrColor = 'rgba(179, 12, 12, 1)';
      const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      health.push(
        new HealthD(x, y, outRadius, inrRadius, inrColor, outColor, velocity)
      );
    }, healthSpawnRate);
  
}

let animationId;
let score = 0;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = 'rgba(0, 0, 0, 0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projectiles.forEach((projectile, index) => {
    projectile.update();

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  projectiles.forEach((projectile, projectileIndex) => {
    health.forEach((healthD, index) => {
      const dist = Math.hypot(
        healthD.x - projectile.x,
        healthD.y - projectile.y
      );

      if (dist - healthD.outRadius - projectile.radius < 1) {
        setTimeout(() => {
          projectiles.splice(index, 1);
          health.splice(index, 1);
        });
      }
    });
  });

  health.every((healthD, index) => {
    healthD.update();
    const dist = Math.hypot(player.x - healthD.x, player.y - healthD.y);
    // when health hits player
    if (dist - healthD.outRadius - player.radius < 1) {
      player.health += 1;
      healthEl.innerHTML = player.health;
      health.splice(index, 1);
    }
  });

    function test(){enemies.forEach((enemy, index) => {
      {
        enemy.update();

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        //enemy collides with player
        if (dist - enemy.radius - player.radius < 1) {
          player.health -= 1;
          healthEl.innerHTML = player.health;
          enemies.splice(index, 1);

          if (player.health <= 0) {
            cancelAnimationFrame(animationId);
            modalEl.style.display = 'flex';
            bigScoreEl.innerHTML = score * 10;
          }
        }

        projectiles.forEach((projectile, projectileIndex) => {
          const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
          // when projectiles touch enemy
          if (dist - enemy.radius - projectile.radius < 1) {
            // create explosions
            for (let i = 0; i < enemy.radius * 2; i++) {
              particles.push(
                new Particle(
                  projectile.x,
                  projectile.y,
                  Math.random() * 2,
                  enemy.color,
                  {
                    x: (Math.random() - 0.5) * (Math.random() * 8),
                    y: (Math.random() - 0.5) * (Math.random() * 8),
                  }
                )
              );
            }

            if (enemy.radius - 10 > 8) {
              // increase score
              score += 50;
              scoreEl.innerHTML = score;

              gsap.to(enemy, {
                radius: enemy.radius - 10,
              });
              setTimeout(() => {
                projectiles.splice(projectileIndex, 1);
              }, 0);
            } else {
              //remove from scene
              // increase score
              score += 100;
              scoreEl.innerHTML = score;

              setTimeout(() => {
                enemies.splice(index, 1);
                projectiles.splice(projectileIndex, 1);
              }, 0);
            }
          }
        });
      }
    });
  }
  test();

}

let paused = false;
let gamePlaying = false;

addEventListener('click', () => {
  if (paused == false) {
    const angle = Math.atan2(
      event.clientY - canvas.height / 2,
      event.clientX - canvas.width / 2
    );

    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };

    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
    );
    gunShot.currentTime = 0;
    gunShot.play();
  }
});


optionsButton.addEventListener('click', () => {
	cancelAnimationFrame(animationId);
	paused = !paused
	pauseScreen.style.display = 'flex'
	returnButton.style.display = 'flex'
	optionsButton.style.display = 'none'	
  clearInterval(spawnInterval);	
  clearInterval(healthInterval)
})

easyButton.addEventListener('click', () => {
	pauseScreen.style.display = 'none'
	if(gamePlaying == true)
	{
		animate()
	}
	optionsButton.style.display = 'flex'
	paused = false;
	enemySpawnRate = 1500;
  healthSpawnRate = 10000;
  spawnEnemies();
  spawnHealth();
		
})

mediumButton.addEventListener('click', () => {
	pauseScreen.style.display = 'none'
	if(gamePlaying == true)
	{
		animate()
	}
	optionsButton.style.display = 'flex'
	paused = false;
	enemySpawnRate = 1300;
  healthSpawnRate = 15000;
  spawnEnemies();
  spawnHealth();
		
})

hardButton.addEventListener('click', () => {
	pauseScreen.style.display = 'none'
	if(gamePlaying == true)
	{
		animate()
	}
	optionsButton.style.display = 'flex'
	paused = false;
	enemySpawnRate = 1100;
  healthSpawnRate = 30000;
  spawnEnemies();
  spawnHealth();
		
})



returnButton.addEventListener('click', () => {
	pauseScreen.style.display = 'none'
	if(gamePlaying == true)
	{
		animate()
	}
  spawnEnemies();
  spawnHealth();
  optionsButton.style.display = 'flex'
	paused = false;
		
})



startGameBtn.addEventListener('click', () => {
  init();
  animate();
  spawnEnemies();
  spawnHealth();
  bgMusic.play();
  paused = false;
  gamePlaying = true;
  modalEl.style.display = 'none';
  setInterval(function test() {
    console.log(enemySpawnRate);
  }, 1000)
});
