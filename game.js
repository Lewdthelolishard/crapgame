const gameState = {};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('cave', 'uwu2.png');
    this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Cave+Crisis/platform.png');
     this.load.spritesheet('codey', 'uwuwu.png', { frameWidth:96, frameHeight: 73 });
    this.load.image('bug1', 'fbi.jpg');
    this.load.image('bug2',  'fbi.jpg');
    this.load.image('bug3',  'fbi.jpg');
    // Loads in the snowman sprite sheet
    
  }

  create() {
    gameState.active = true;

    this.add.image(0, 0, 'cave').setOrigin(0, 0);

    gameState.player = this.physics.add.sprite(225, 450, 'codey').setScale(.5);



    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 1}),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('codey', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    });
  
     const platforms = this.physics.add.staticGroup();
    const platPositions = [
      { x: 50, y: 600 }, { x: 250, y: 600 }, { x: 450, y: 600 }
    ];
    platPositions.forEach(plat => {
      platforms.create(plat.x, plat.y, 'platform')
    });
   
    gameState.scoreText = this.add.text(195, 485, 'Score: 0', { fontSize: '15px', fill: '#000000' });
  
    gameState.player.setCollideWorldBounds(true);
  
    this.physics.add.collider(gameState.player, platforms);
    
    gameState.cursors = this.input.keyboard.createCursorKeys();
  
    const bugs = this.physics.add.group();
  
    function bugGen () {
      const xCoord = Math.random() * 450;
      bugs.create(xCoord, 10, 'bug1');
    }
  
    const bugGenLoop = this.time.addEvent({
      delay: 100,
      callback: bugGen,
      callbackScope: this,
      loop: true,
    });
  
    this.physics.add.collider(bugs, platforms, function (bug) {
      bug.destroy();
      gameState.score += 10;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
    })
    
    this.physics.add.collider(gameState.player, bugs, () => {
      bugGenLoop.destroy();
      this.physics.pause();
      this.add.text(180, 250, 'Game Over', { fontSize: '15px', fill: '#000000' });
      this.add.text(152, 270, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
      
      // Add your code below:
      this.input.on('pointerup', () =>{
        gameState.score = 0;
        this.scene.restart();
      });
    });
  }
  update() {
    
    if (gameState.active) {
      if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(350);
        gameState.player.anims.play('run', true);
        gameState.player.flipX = false;
      } else if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-350);
        gameState.player.anims.play('run', true);
        gameState.player.flipX = true;
      } else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('idle', true);
      }
    }
    }
}


const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      enableBody: true,
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
