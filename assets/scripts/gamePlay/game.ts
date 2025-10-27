import { _decorator, Component, director, EventTouch, Input, input, instantiate, Node, NodeEventType, Prefab, ResolutionPolicy, RigidBody2D, screen, Size, size, Vec2, View, view } from 'cc';
import { gp } from './GlobalProperties';
import { PlayerController } from './PlayerController';
import { GameStatus, LocalStorageItems } from '../Constants';
import { AudioManager } from '../AudioManager';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {

    player : PlayerController = null;

    @property([Prefab])
    playersPrefab : Prefab[] = [];
    @property(Prefab)
    firePrefab : Prefab = null;
    @property(AudioManager)
    audioManager : AudioManager = null;
    @property(Node)
    playerParent : Node = null;
    @property(Node)
    fireParent : Node = null;

    protected onLoad(): void {
        this.audioManager = this.node.getParent().getComponentInChildren(AudioManager);
    }

    start() {
        this.init();
        input.on(Input.EventType.TOUCH_START, this.touchStart, this); 
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    update(deltaTime: number) {

    }


    touchStart(event : EventTouch) {
        
        const touchPoint = event.getLocation();
        console.log("game touch");
        if (touchPoint.x < screen.windowSize.width / 2) {
            this.player.jump(-1);
        } else {
            this.player.jump(1);
        }
    }

    init() {
        gp.gameStatus = GameStatus.WAIT_TO_START;
        this.playerParent = this.node.getChildByName('Players');
        this.fireParent = this.node.getChildByName('Fires');
        this.playerInit();
        this.fireInit();
        this.initUI();
        if (!this.audioManager.isplayingBGM01()) {
            this.audioManager.playBGM(1); 
        }
        
    }

    playerInit() {
        const playerIndex = Number(localStorage.getItem(LocalStorageItems.CURRENT_HERO_INDEX) 
            ? localStorage.getItem(LocalStorageItems.CURRENT_HERO_INDEX) : 0)
        let newPlayer = instantiate(this.playersPrefab[playerIndex]);
        newPlayer.setPosition(0, 0);
        newPlayer.setParent(this.playerParent);
        this.player = newPlayer.getComponent(PlayerController);
    }

    fireInit() {
        let newFire = instantiate(this.firePrefab);
        newFire.setPosition(0, -2000);
        newFire.setParent(this.fireParent);
    }

    initUI() {
        const tapToStartUI = this.node.getChildByName('TapToStartUI');
        tapToStartUI.active = true;
    }

}


