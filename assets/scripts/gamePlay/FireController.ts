import { _decorator, Component, Details, math, Node } from 'cc';
import { PlayerController } from './PlayerController';
import { gp } from './GlobalProperties';
import { GameStatus } from '../Constants';
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
        if (gp.gameStatus != GameStatus.GAMING) {
            return;
        }
        let playerY = this.player.node.position.y;
        let curY = this.node.position.y;
        //火焰的速度主要受两个因素
        //1.火焰到主角的距离  speed1 = 0.000001x^{3}  火焰距离主角近时无影响，距离远时方便快速追上主角
        //2.当前已经走过的距离  speed2 = 根号（100x）  根据已走过距离缓慢增加速度，后续速度增长速度较慢，因为speed2已经很快，每快一点压迫感都增加很多
        const distence = playerY - curY;
        const speed1 = 0.000001 * Math.pow(distence, 3);
        const speed2 = Math.sqrt(100 * Math.max(playerY, 0));
        const newY = math.lerp(curY, curY + deltaTime * (speed1 + speed2), this.lerpFactor);
        this.node.setPosition(0, newY);
    }
}


