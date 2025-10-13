import { _decorator, Component, instantiate, math, Node, Prefab } from 'cc';
import { G_VIEW_SIZE } from './game';
import { gp } from './GlobalProperties';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('ObstacleController')
export class ObstacleController extends Component {
    
    @property(Prefab)
    obstacle01 : Prefab = null;
    
    player : PlayerController = null;
    obs : Node[] = [];

    start() {
        this.initObs();
        this.player = this.node.getParent().getChildByName('Players').getComponentInChildren(PlayerController);
    }

    update(deltaTime: number) {
        if (!gp.isGameStart || gp.settingPause) {
            return;
        }
        const curPlayerY = this.player.node.position.y;
        if (curPlayerY - this.obs[0].position.y > G_VIEW_SIZE.height * 2) {
            const shiftOb = this.obs.shift();
            shiftOb.destroy();
        }
        if (this.obs[this.obs.length - 1].position.y - curPlayerY < G_VIEW_SIZE.height) {
            const randomDistanceY = math.randomRange(300, 500);
            const randomDistanceX = math.randomRange(-360, 360);
            const newOb = this.createNewObstacle(randomDistanceX, (this.obs[this.obs.length - 1].position.y + randomDistanceY));
            this.obs.push(newOb);
        }
        
    }

    initObs() {
        let lastHeight = G_VIEW_SIZE.height / 2;
        while (lastHeight < G_VIEW_SIZE.height * 2) {
            const randomDistanceY = math.randomRange(300, 500);
            lastHeight += randomDistanceY;
            const randomDistanceX = math.randomRange(-360, 360);
            const newOb = instantiate(this.obstacle01);
            newOb.setPosition(randomDistanceX, lastHeight);
            newOb.setParent(this.node);
            this.obs.push(newOb);
        }
    }

    createNewObstacle(x : number, y : number) : Node {
        const newOb = instantiate(this.obstacle01);
        newOb.setPosition(x, y);
        newOb.setParent(this.node);
        return newOb;
    }

}


