import { _decorator, Component, director, EventTouch, Input, input, Node } from 'cc';
import { gp } from './GlobalProperties';
import { GameStatus } from '../Constants';
const { ccclass, property } = _decorator;

@ccclass('HeroSelectButton')
export class HeroSelectButton extends Component {
    start() {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this);
    }

    update(deltaTime: number) {
        
    }

    touchStart(event : EventTouch) {
        if (gp.gameStatus != GameStatus.WAIT_TO_START) {
            return;
        }
        director.loadScene('heroSelect');
    }
}


