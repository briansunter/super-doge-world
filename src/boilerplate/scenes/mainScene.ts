export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private player: Phaser.Physics.Arcade.Sprite;
  private cursors: CursorKeys;
  private map: Phaser.Tilemaps.Tilemap;
  private layer: Phaser.Tilemaps.StaticTilemapLayer;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    this.load.tilemapTiledJSON('mario', 'assets/boilerplate/super_mario.json');
    this.load.image('tiles', 'assets/boilerplate/super_mario.png');
    this.load.spritesheet('player',
                          'assets/boilerplate/shiba.png',
                          { frameWidth: 32, frameHeight: 32 });
  };

  create(): void {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, 6400, 600).setName('main');

    this.map = this.add.tilemap('mario');
    const tileSet = this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    this.map.setCollisionBetween(15, 16);
    this.map.setCollisionBetween(20, 25);
    this.map.setCollisionBetween(27, 29);
    this.map.setCollision(40);

    this.layer = this.map.createStaticLayer('World1',tileSet,0,0);
    this.layer.setScale(2);

    this.player = this.physics.add.sprite(100, 350, 'player').setScale(2);
    this.player.setBounce(0.2);
    this.physics.add.collider(this.player, this.layer);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player', frame: 24 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'jumping',
      frames: this.anims.generateFrameNumbers('player', { start: 32, end: 34 }),
      frameRate: 10,
      repeat: -1
    });
  }

  update(): void {
    this.cameras.main.scrollX = this.player.x - 400;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-260);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(260);

      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-330);
    }

    if (! this.player.body.onFloor()) {
      this.player.anims.play('jumping', true);
    }
  }
}
