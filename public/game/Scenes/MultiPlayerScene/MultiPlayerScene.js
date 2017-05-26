import BaseScene from '../BaseScene/BaseScene';
import Player from '../../Three/Objects/Player/Player';
import Bullet from '../../Three/Objects/Bullet/Bullet';
import PlayerService from '../../Manager/PlayerManager/PlayerManager';
import playersService from '../../Manager/PlayersManager/PlayersManager';
import BulletService from '../../Manager/BulletManager/BulletManager';
import bulletsService from '../../Manager/BulletsManager/BulletsManager';
import playerStats from '../../Tools/PlayerStats/PlayerStats';
import map from '../../Tools/Map/Map';
import Helper from '../../Tools/Helper/Helper';
import CollisionService from '../../Manager/CollisionManager/CollisionManager';
import AIService from '../../Manager/AIManager/AIManager';
import musicService from '../../Tools/MusicService/MusicService';
import GameTableManager from '../../Manager/GameTableManager/GameTableManager';
import {
  UNITSIZE,
  MOVESPEEDAI,
  BULLETMOVESPEED
} from '../../Constants/Constants';
import {
  SNAPSHOT,
  REMOVE_PLAYER
} from '../../Constants/MultiPlayer';

export default class MultiPlayerScene extends BaseScene {
  constructor(keys, mouse, gameWebSocketManager, functionGo) {
    super(keys, mouse, functionGo);

    this._game = false;
    this._id = +localStorage.getItem('id');

    this._webSocketManager = gameWebSocketManager;
    this._gameTableManager = new GameTableManager();

    this._isInitLeaderboard = false;
  }

  set game(value) {
    this._game = value;
  }

  get game() {
    return this._game;
  }

  _init() {
    this._webSocketManager.setOnMessage(this._setUpWebSockets());
    musicService.stopBackground();

    this._initScenePreferences();

    this._makeScene();

    this._setUpRender();
  }

  _setUpWebSockets() {
    return (content, data) => {
      console.log(content);

      switch (content.type) {
        case SNAPSHOT:
          if (!this._isInitLeaderboard) {
            this._updateTable(this._makeListPlayers(data.players), this._id);
            this._isInitLeaderboard = true;
          }

          if (data.shot) {
            // anim
          }

          // change hp

          if (data.hp === 0) {
            // reborn
          }

          // show death on screen

          data.players.forEach(player => {
            const playerId = player.id;

            if (playerId === this._id) {
              return;
            }

            const playerPosition = player.position;

            if (playerPosition === null) {
              return;
            }

            // players - manager
            if (this._playersService.getFullPlayer(`id${playerId}`) === undefined) {
              const playerObject = new Player().object;
              this._playersService.setFullPlayer(playerId, playerObject);
              this._playersService.getFullPlayer(`id${playerId}`)
                .position.copy(playerPosition);

              this._playersService.add(new PlayerService(playerObject, 100));

              this._scene.add(playerObject);

              this._updateTable(this._makeListPlayers(data.players), this._id);
            } else {
              this._playersService.getFullPlayer(`id${playerId}`)
                .position.copy(playerPosition);
            }
          });
          break;
        case REMOVE_PLAYER:
          data.forEach(element => {
            this._scene.remove(this._playersService.getFullPlayer(element));
            this._playersService.removeFullPlayer(element);
          });
          break;
        default:
          break;
      }
    };
  }

  _animate() {
    if (this._isAnimate) {
      requestAnimationFrame(this._animate.bind(this));
    }

    this._updateBackEnd();
    this._render();
  }

  _updateBackEnd() {
    this._webSocketManager.send({
      type: 'application.mechanics.base.UserSnap',
      data: {
        position: this._getCameraPosition(),
        id: this._player.id,
        camera: this._getCameraRotation(),
        firing: false
      }
    });
  }

  _getCameraPosition() {
    return {
      x: this._camera.position.x,
      y: this._camera.position.y,
      z: this._camera.position.z
    };
  }

  _getCameraRotation() {
    return {
      x: this._camera.rotation.x,
      y: this._camera.rotation.y,
      z: this._camera.rotation.z
    };
  }

  _addAI() {
    const position = Helper.getMapSector(this._camera.position);

    let [x, z] = Helper.getRandomPosition();
    while (map._map[x][z] > 0 || (x === position.x && z === position.z)) {
      [x, z] = Helper.getRandomPosition();
    }

    x = Math.floor(x - map.width / 2) * UNITSIZE;
    z = Math.floor(z - map.width / 2) * UNITSIZE;

    const playerObject = new Player().object;
    playerObject.position.set(x, UNITSIZE * 0.15, z);

    playersService.add(new PlayerService(playerObject, 100));
    this._scene.add(playerObject);
  }

  _updateBullets(delta) {
    for (let i in bulletsService.all) {
      const bullet = bulletsService.getBullet(i);
      const position = bullet.object.position;

      if (CollisionService.collisionBulletWithWall(position)) {
        bulletsService.remove(i);
        this._scene.remove(bullet.object);

        continue;
      }

      // Collide with AI
      let hit = CollisionService.collisionBulletWithAi(
        this._scene,
        playersService,
        bulletsService,
        bullet,
        position,
        i
      );

      // Bullet hits player
      CollisionService.collisionBulletWithPlayer(
        this._scene,
        playerStats,
        bulletsService,
        position,
        this._camera,
        bullet,
        i
      );

      if (!hit) {
        const speed = delta * BULLETMOVESPEED;
        const direction = bullet.object.ray.direction;

        bullet.object.translateX(speed * direction.x);
        bullet.object.translateZ(speed * direction.z);
      }
    }
  }

  _render() {
    const delta = this._clock.getDelta();
    this._keys.update(this._camera, delta, Helper.checkWallCollision.bind(this));

    // Update bullets.
    this._updateBullets(delta);

    if (this._game) {
      for (let i in playersService.all) {
        AIService.updateAI(
          this._scene,
          playersService,
          playerStats,
          delta * MOVESPEEDAI,
          i,
          this._addAI.bind(this)
        );

        const player = playersService.getPlayer(i);
        const sector = Helper.getMapSector(player.object.position);

        AIService.shoot(
          this._camera,
          player,
          sector,
          this._createBullet.bind(this)
        );
      }
    }

    this._renderer.render(this._scene, this._camera);

    // Death
    this._death();
  }

  _death() {
    if (playerStats.health <= 0) {
      this.stop();
      this._keys._deactivateTable();

      musicService.startEndGame();
      this._openEndGame();

      setTimeout(() => {
        localStorage.setItem('singlePlayerScore', playerStats.kills * 100);
        this._closeEndGame();
        this._goToFromGame();
        location.reload();
      }, 4000);
    }
  }

  _createBullet(object) {
    if (object === undefined) {
      object = this._camera;
    }

    const bullet = new BulletService(new Bullet().object, object, this._camera);

    bulletsService.add(bullet);
    this._scene.add(bullet.object);
  }

  _updateTable(data, id, type) {
    this._gameTableManager.setData(data, id, type);
  }

  _makeListPlayers(list) {
    const players = [];

    for (let field of list) {
      players.push([field.login, field.kills, field.deaths, field.id]);
    }

    return players;
  }
}
