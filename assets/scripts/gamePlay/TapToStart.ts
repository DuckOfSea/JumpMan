import { __private, _decorator, Component, director, EventTouch, find, Input, input, Node } from 'cc';
import { gp } from './GlobalProperties';
import { HeroSelectButton } from './HeroSelectButton';
import { HighestScoreButton } from './HighestScoreButton';
import { HeroSelectController } from '../heroSelect/HeroSelectController';
import { UIController } from './UIController';
import { GameStatus } from '../Constants';
const { ccclass, property } = _decorator;

@ccclass('TapToStart')
export class TapToStart extends Component {

    UINode : UIController = null;

    protected onLoad(): void {
        console.log('taptostart onload');
        this.node.active = true;
    }

    start() {
        this.UINode = find('Canvas/UI-Node')!.getComponent(UIController);
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this, true);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this, true);
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this, true);
    }
    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this, true);
    }

    update(deltaTime: number) {
        
    }

    touchStart(event : EventTouch) { 
        console.log("touch taptostart")
        if (gp.gameStatus != GameStatus.WAIT_TO_START) {
            return;
        }
        gp.gameStatus = GameStatus.GAMING;
        this.node.active = false;
        console.log("taptostart");
        this.UINode.showHeightUI();
        this.closeOtherButton();
    }

    closeOtherButton() {
        let highestScoreNode = this.node.getParent().getComponentInChildren(HighestScoreButton);
        highestScoreNode.node.active = false;
        let heroselectNode = this.node.getParent().getComponentInChildren(HeroSelectButton);
        heroselectNode.node.active = false;
    }

}


