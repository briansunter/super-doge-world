export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private platforms: Phaser.Physics.Arcade.Group;
  private hero: Phaser.Physics.Arcade.Sprite;
  private squishy: Phaser.Physics.Arcade.Sprite;
  private cursors: CursorKeys;
  private map: Phaser.Tilemaps.Tilemap;
  private layer: Phaser.Tilemaps.StaticTilemapLayer;
  private jumpTime: number = 0;
  private hasReleased: boolean = true;
  private coins: Phaser.GameObjects.Sprite[];
  private coinsGroup: Phaser.Physics.Arcade.StaticGroup;
  private coinsCollected: number = 0;
  private score: Phaser.GameObjects.Text;
  private tilemapPath: string;

  constructor(name: string, tilemapPath: string) {
    super({
      key: name
    });
    this.tilemapPath = tilemapPath;
  }
  //assets/boilerplate/super_mario.json
  preload(): void {
    this.load.tilemapTiledJSON('mario', this.tilemapPath);
    this.load.image('tiles', 'assets/boilerplate/super_mario.png');
    this.load.image('squishy', 'assets/boilerplate/squishy.png')
    this.load.spritesheet('hero',
      'assets/boilerplate/shiba.png',
      { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('bitcoin',
      'assets/boilerplate/bitcoin.png',
      { frameWidth: 32, frameHeight: 32 });
  };

  create(): void {
    this.physics.world.drawDebug

    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, 6400, 600).setName('main');

    this.map = this.add.tilemap('mario');
    const tileSet = this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    this.map.setCollisionBetween(15, 16);
    this.map.setCollisionBetween(20, 25);
    this.map.setCollisionBetween(27, 29);
    this.map.setCollision(40);

    this.anims.create({
      key: 'spin',
      frames: this.anims.generateFrameNumbers('bitcoin', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.layer = this.map.createStaticLayer('World1', tileSet, 0, 0);
    this.layer.setScale(2);

    this.hero = this.physics.add.sprite(100, 350, 'hero').setScale(2);
    this.hero.setBounce(0.1);
    this.physics.add.collider(this.hero, this.layer);

    this.coins = this.map.createFromTiles(11, 1, { key: 'bitcoin', scale: 2 });

    this.coinsGroup = this.physics.add.staticGroup();
    this.coins.forEach(c => {
      c.anims.play('spin', true);
      c.x = c.x + c.width / 2;
      this.coinsGroup.add(c);
    });

    this.physics.add.overlap(this.hero, this.coinsGroup, this.collectCoin, null, this);

    this.score = this.add.text(window.innerWidth - 300, 16, 'coins: 0', { fontSize: '32px', fill: '#000' });
    this.score.setScrollFactor(0);

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jumping',
      frames: this.anims.generateFrameNumbers('hero', { start: 32, end: 34 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update(): void {
    this.hero.setVelocityX(100);
    this.hero.anims.play('right', true);
    this.cameras.main.scrollX = this.hero.x - 400;

    if (this.cursors.up.isDown || this.input.activePointer.isDown) {
      if (this.hero.body.onFloor() && this.hasReleased) {
        this.jumpTime = this.time.now;
      }
      this.hasReleased = false;
    } else {
      this.hasReleased = true;
    }

    if (this.time.now - this.jumpTime < 200) {
      this.hero.setVelocityY(-450);
    }

    if (!this.hero.body.onFloor()) {
      this.hero.anims.play('jumping', true);
    }

    if (this.hero.body.y > 1000) {
      console.log("DED");
      this.scene.start("MainScene");
    }
  }

  collectCoin(hero: Phaser.GameObjects.Sprite, coin: Phaser.GameObjects.Sprite): void {
    this.coinsCollected++;
    this.score.setText(`coins: ${this.coinsCollected}`);
    coin.destroy();
  }
}
