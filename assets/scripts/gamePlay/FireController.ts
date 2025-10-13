import { _decorator, Component, Details, math, Node } from 'cc';
import { PlayerController } from './PlayerController';
import { gp } from './GlobalProperties';
const { ccclass, property } = _decorator;

@ccclass('FireController')
export class FireController extends Component {
    
    player : PlayerController = null;
    
    fastSpeed : number = 5000;
    normalSpeed : number = 1000;
    slowSpeed : number = 500;

    private lerpFactor : number = 0.1;

    start() {
        this.player = this.node.getParent().getParent().getChildByName('Players').getComponentInChildren(PlayerController);
    }

    update(deltaTime: number) {
        if (!gp.isGameStart || gp.settingPause) {
            return;
        }
        let playerY = this.player.node.position.y;
        let curY = this.node.position.y;
        let newY = 0;
        if (playerY - curY > 1000) {
            newY = math.lerp(curY, curY + deltaTime * this.fastSpeed, this.lerpFactor);
        } else if (playerY - curY > 500) {
            newY = math.lerp(curY, curY + deltaTime * this.normalSpeed, this.lerpFactor);
        } else {
            newY = math.lerp(curY, curY + deltaTime * this.slowSpeed, this.lerpFactor);
        }
        this.node.setPosition(0, newY);
    }
}


