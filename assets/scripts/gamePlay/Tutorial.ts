import { _decorator, Component, Node, UITransform } from 'cc';
import { PlayerController } from './PlayerController';
import { GameStatus } from '../Constants';
import { gp } from './GlobalProperties';
import { CameraFollow } from './CameraFollow';
const { ccclass, property } = _decorator;

@ccclass('Tutorial')
export class Tutorial extends Component {
    
    @property(PlayerController)
    player : PlayerController = null;
    @property(Node)
    gamePlay : Node = null;
    left : Node = null;
    right : Node = null;
    @property(Node)
    camera : Node = null;
    
    onLoad() {
        this.camera = this.node.getParent().getChildByName('Camera');
        this.gamePlay = this.node.getChildByName('GamePlay');
        this.left = this.gamePlay.getChildByName('Left');
        this.right = this.gamePlay.getChildByName('Right');
        this.node.active = false;
        this.gamePlay.active = false;
    }

    protected start(): void {
        this.player = this.node.getParent().getChildByName('Players').getComponentInChildren(PlayerController);
    }

    protected onDestroy(): void {

    }

    protected onEnable(): void {
        this.gamePlay.on(Node.EventType.TOUCH_START, this.doNothing, this);
        this.left.on(Node.EventType.TOUCH_START, this.gamePlayTutorial01, this);
        this.right.on(Node.EventType.TOUCH_START, this.gamePlayTutorial02, this);
    }

    protected onDisable(): void {
        this.gamePlay.off(Node.EventType.TOUCH_START, this.doNothing, this);
        this.left.off(Node.EventType.TOUCH_START, this.gamePlayTutorial01, this);
        this.right.off(Node.EventType.TOUCH_START, this.gamePlayTutorial02, this);  
    }

    update(deltaTime: number) {

    }

    startGamePlayTutorial() {
        this.node.active = true;
        this.gamePlay.active = true;
        this.left.active = true;
        this.right.active = false;
        gp.gameStatus = GameStatus.TUTORIAL;
        this.node.setPosition(this.camera.position);
    }

    gamePlayTutorial01() {
        this.left.active = false;
        this.right.active = true;
    }

    gamePlayTutorial02() {
        this.node.active = false;
        gp.gameStatus = GameStatus.GAMING;
    }

    doNothing() {

    }
}


