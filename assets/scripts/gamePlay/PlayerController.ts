import { _decorator, clamp, Collider, Collider2D, Component, Contact2DType, director, ERigidBody2DType, find, Game, ICollisionEvent, IPhysics2DContact, Node, RigidBody, RigidBody2D, Sprite, SpriteFrame, Texture2D, tween, Vec2, Vec3 } from 'cc';
import { GameOverController } from './GameOverController';
import { gp } from './GlobalProperties';
import { AudioManager} from '../AudioManager';
import { GroupNum } from '../Constants';
import { UIController } from './UIController';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

 
    rigidBody : RigidBody2D = null;
    collider : Collider2D = null;
    GameOverUI : GameOverController = null;
    UINode : UIController = null;
    @property(AudioManager)
    audioManager : AudioManager = null;
    lastPosition : Vec3 = null;
    lastLinearVelocity : Vec2 = null;
    isDead : boolean = false;

    bounceTimer : number = 0;
    jumpTimer : number = 0;
    maxHeight : number = 0;

    protected onLoad(): void {
        this.audioManager = director.getScene().getComponentInChildren(AudioManager);
    }

    protected start(): void {
        this.rigidBody = this.node.getComponent(RigidBody2D);
        this.collider = this.node.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.GameOverUI = find('Canvas/GameOverUI')!.getComponent(GameOverController);
        this.UINode = find('Canvas/UI-Node')!.getComponent(UIController);
        
        this.lastPosition = new Vec3(0, 0, 0);
        this.lastLinearVelocity = new Vec2(0, 0);
    }

    protected update(dt: number): void {
        if (!gp.isGameStart || gp.settingPause) {
            this.rigidBody.type = ERigidBody2DType.Static;
            return;
        }
        this.rigidBody.type = ERigidBody2DType.Dynamic;
        if (this.rigidBody) {
            if (this.node.position.x > 310) {
                this.node.setPosition(310, this.node.position.y);
                this.rigidBody.linearVelocity = new Vec2(-this.rigidBody.linearVelocity.x * 0.5, this.rigidBody.linearVelocity.y);
                this.bounce()
            }
            if (this.node.position.x < -310) {
                this.node.setPosition(-310, this.node.position.y);
                this.rigidBody.linearVelocity = new Vec2(-this.rigidBody.linearVelocity.x * 0.5, this.rigidBody.linearVelocity.y);
                this.bounce()
            }
        }
        this.bounceTimer += dt;
        this.jumpTimer += dt;
        if (this.node.position.y > this.maxHeight) {
            this.maxHeight = Math.floor(this.node.position.y);
            this.UINode.changeMaxHeight(this.maxHeight);
        }
    }

    jump(dir : number) {
        //console.log("jump")
        this.rigidBody.linearVelocity = new Vec2(this.rigidBody.linearVelocity.x + 5 * dir, this.rigidBody.linearVelocity.y + 10);
        if (this.jumpTimer > 0.2) {
            //this.audioManager.playSFX(1, 0.5)
            this.jumpTimer = 0;
        }
        
    } 

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (otherCollider.group == GroupNum.SPINE) {
            if (!this.isDead) {
                this.onPlayerDie();
            }
        } else if (otherCollider.group == GroupNum.OBSTACLE) {
            const worldManifold = contact.getWorldManifold()
            this.bounce()
        }
    }

    onPlayerDie() {
        this.isDead = true;
        director.pause();
        this.GameOverUI.showGameOver(Math.floor(this.maxHeight));
    }

    bounce() {
        //防止落在障碍物上时连续音效炸麦
        if (this.bounceTimer < 0.2) {
            this.bounceTimer = 0; // 设置为正在弹跳状态
            return;
        }
        this.audioManager.playSFX(2, 1);
        this.bounceTimer = 0; // 设置为正在弹跳状态
        const ball = this.node; // 获取当前节点（小球）

        // 创建弹跳动画并重置位置和缩放
        tween(ball)
        .stop() // 停止之前的动画
        .to(0.1, { scale: new Vec3(1.2, 0.8, 1) }) // 上升
        .to(0.1, { scale: new Vec3(0.8, 1.2, 1) }) // 下落
        .to(0.1, { scale: new Vec3(1.1, 0.9, 1) }) // 轻微反弹
        .to(0.01, { scale: new Vec3(1, 1, 1) }) // 回到地面
        .start();
    }
}


