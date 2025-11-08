import { _decorator, Animation, Component, director, EventTouch, Input, input, Node } from 'cc';
import { gp } from './GlobalProperties';
import { GameStatus } from '../Constants';
const { ccclass, property } = _decorator;

@ccclass('HeroSelectButton')
export class HeroSelectButton extends Component {

    @property(Animation)
    anim : Animation = null;

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.anim = this.node.getComponent(Animation);
        this.anim.play('button_entrance');
        setTimeout(() => {
            this.anim.play('button_idle');
        }, 1000);
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


