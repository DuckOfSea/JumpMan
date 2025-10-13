import { _decorator, Component, EventTouch, math, Node, NodeEventType } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property
    player : PlayerController = null;

    private lerpFactor : number = 0.1;


    start() {
        this.player = this.node.getParent().getChildByName('Players').getComponentInChildren(PlayerController);
    }

    protected onDestroy(): void {
        
    }

    update(deltaTime: number) {
        if (this.player == null) {
            console.log("camera  player is null")
            return;
        }
        const playerPosY = this.player.node.position.y;
        const curPosY = this.node.position.y;
        let newY = curPosY;
        if (playerPosY != curPosY) {
            newY = math.lerp(curPosY, playerPosY, this.lerpFactor);
        }
        this.node.setPosition(0, newY);
    }


}


