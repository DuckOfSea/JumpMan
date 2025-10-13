import { _decorator, Component, instantiate, Node, Prefab, UITransform } from 'cc';
import { PlayerController } from './PlayerController';
import { G_VIEW_SIZE } from './game';
const { ccclass, property } = _decorator;


const MAP_COUNT = 5;


@ccclass('BgController')
export class BgController extends Component {
    @property(Prefab)
    bgpf : Prefab;
    
    player : PlayerController = null;

    maps : Node[] = [];

    start() {
        this.initBG();
        this.player = this.node.getParent().getChildByName('Players').getComponentInChildren(PlayerController);
    }

    update(deltaTime: number) {
        const curPlayerY = this.player.node.position.y;
        if (curPlayerY - this.maps[0].position.y > G_VIEW_SIZE.height * 3) {
            const tmpMap = this.maps.shift();
            tmpMap.setPosition(0, this.maps[MAP_COUNT - 2].position.y + G_VIEW_SIZE.height);
            this.maps.push(tmpMap);
        } else {
            if (this.maps[MAP_COUNT - 1].position.y - curPlayerY > G_VIEW_SIZE.height * 3) {
                const tmpMap = this.maps.pop();
                tmpMap.setPosition(0, this.maps[0].position.y - G_VIEW_SIZE.height);
                this.maps.unshift(tmpMap);
            } else {
                //正常情况不处理
            }
        }
    }

    initBG() {
        for (let i = 0; i < MAP_COUNT; i++) {
            const newBG = instantiate(this.bgpf);
            newBG.getComponent(UITransform).setContentSize(G_VIEW_SIZE.width, G_VIEW_SIZE.height);
            newBG.setParent(this.node);
            newBG.setPosition(0, G_VIEW_SIZE.height * (i - 2));
            this.maps.push(newBG);
        }
    }
}


