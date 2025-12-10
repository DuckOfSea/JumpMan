import { _decorator, clamp, Collider, Collider2D, Component, Contact2DType, director, ERigidBody2DType, find, Game, ICollisionEvent, IPhysics2DContact, Node, RigidBody, RigidBody2D, Sprite, SpriteFrame, Texture2D, tween, Vec2, Vec3 } from 'cc';
import { GameOverController } from './GameOverController';
import { gp } from './GlobalProperties';
import { AudioManager} from '../AudioManager';
import { GameStatus, GroupNum } from '../Constants';
import { UIController } from './UIController';
import { Tutorial } from './Tutorial';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

 
    rigidBody : RigidBody2D = null;
    collider : Collider2D = null;
    @property(GameOverController)
    GameOverUI : GameOverController = null;
    UINode : UIController = null;
    @property(AudioManager)
    audioManager : AudioManager = null;
    isDead : boolean = false;
    surroundingBall : Node = null;
    isIgnore : boolean = false;

    bounceTimer : number = 0;
    maxHeight : number = 0;
    ignoreTimer : number = 0;


    protected onLoad(): void {
        this.audioManager = director.getScene().getComponentInChildren(AudioManager);
    }

    protected start(): void {
        this.rigidBody = this.node.getComponent(RigidBody2D);
        this.collider = this.node.getComponent(Collider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.GameOverUI = find('Canvas/GameOverUI')!.getComponent(GameOverController);
        this.UINode = find('Canvas/UI-Node')!.getComponent(UIController);
        this.surroundingBall = this.node.getChildByName('surroundingBall');
        this.surroundingBall.active = false;
        
    }

    protected update(dt: number): void {
        if (gp.gameStatus != GameStatus.GAMING) {
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
        if (this.isIgnore) {
            this.ignoreTimer += dt;
            if (this.ignoreTimer > 5) {
                this.rigidBody.group = GroupNum.PLAYER;
                this.collider.group = GroupNum.PLAYER;
                this.surroundingBall.active = false;
                this.audioManager.playBGM(1)
                this.isIgnore = false;
            }
        }
        if (this.node.position.y > this.maxHeight) {
            this.maxHeight = Math.floor(this.node.position.y);
            this.UINode.changeMaxHeight(this.maxHeight);
        }
    }

    jump(dir : number) {
        this.rigidBody.linearVelocity = new Vec2(this.rigidBody.linearVelocity.x + 5 * dir, 
            this.rigidBody.linearVelocity.y + 10);
        
    } 

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
        if (otherCollider.group == GroupNum.SPINE) {
            if (gp.gameStatus == GameStatus.GAMING && !this.isDead) {
                this.onPlayerDie();
            }
        } else if (otherCollider.group == GroupNum.OBSTACLE) {
            this.bounce()
        } else if (otherCollider.group == GroupNum.ITEM) {
            if (otherCollider.node.name.startsWith("item01-ignore")) {
                setTimeout(() => {
                    otherCollider.node.active = false;
                }, 100);
                otherCollider.enabled = false;
                this.rigidBody.group = GroupNum.DEFAULT;
                this.collider.group = GroupNum.DEFAULT;
                this.surroundingBall.active = true;
                this.isIgnore = true;
                this.ignoreTimer = 0;
                this.audioManager.playBGM(3);
                if (otherCollider.node.name == "item01-ignore-tutorial") {
                    const tutorial = find('Canvas/Tutorial')!.getComponent(Tutorial);
                    tutorial.startIgnoreTutorial();
                }
            } else if (otherCollider.node.name.startsWith("item02-yuanbao")) {
                setTimeout(() => {
                    otherCollider.node.active = false;
                }, 100);
                otherCollider.enabled = false;
                this.UINode.changeYuanbaoNum(1);
                this.audioManager.playSFX(4);
            }
        }
    }

    onPlayerDie() {
        this.isDead = true;
        gp.gameStatus = GameStatus.GAME_OVER;
        this.GameOverUI.showGameOver(Math.floor(this.maxHeight));
    }

    bounce() {
        //防止落在障碍物上时连续音效炸麦
        if (this.bounceTimer < 0.2) {
            this.bounceTimer = 0; // 设置为正在弹跳状态
            return;
        }
        this.audioManager.playSFX(2);
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


