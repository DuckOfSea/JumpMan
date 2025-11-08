import { _decorator, Component, instantiate, math, Node, Prefab, UITransform } from 'cc';
import { gp } from './GlobalProperties';
import { PlayerController } from './PlayerController';
import { ElementData, G_VIEW_SIZE, GameStatus } from '../Constants';
const { ccclass, property } = _decorator;

@ccclass('ElementController')
export class ElementController extends Component {
    
    @property(Prefab)
    element01 : Prefab = null;
    @property(Prefab)
    element02 : Prefab = null;
    @property(Prefab)
    element03 : Prefab = null;

    lastHeight : number = G_VIEW_SIZE.height / 2;
    
    player : PlayerController = null;
    @property([Node])
    elements : Node[] = [];

    start() {
        this.initElements();
        this.player = this.node.getParent().getChildByName('Players').getComponentInChildren(PlayerController);
    }

    update(deltaTime: number) {
        if (gp.gameStatus != GameStatus.GAMING) {
            return;
        }
        const curPlayerY = this.player.node.position.y;
        if (curPlayerY - (this.elements[0].position.y + this.elements[0].getComponent(UITransform).contentSize.y / 2) > G_VIEW_SIZE.height * 2) {
            const shiftOb = this.elements.shift();
            shiftOb.destroy();
        }
        const lastOne = this.elements[this.elements.length - 1];
        if (lastOne.position.y - lastOne.getComponent(UITransform).contentSize.y / 2 - curPlayerY < G_VIEW_SIZE.height) {
            const randomNum = math.randomRange(0, 100);
            let newOb = null; 
            if (randomNum < 5) {   //5%
                newOb = this.createNewElement(2);
            } else if (randomNum < 15) {   //10%
                newOb = this.createNewElement(3);
            } else {  // 85% 
                newOb = this.createNewElement(1);
            }
            
            this.elements.push(newOb);
        }
        
    }

    initElements() {
        while (this.lastHeight < G_VIEW_SIZE.height * 2) {
            const newOb = this.createNewElement(1);
            this.elements.push(newOb);
        }
    }

    createNewElement(idx : number) : Node {
        let newOb : Node = null;
        let randomDistanceX = 0;
        let randomDistanceY = math.randomRange(300, 600);
        switch (idx) {
            case 1:
                randomDistanceY = math.randomRange(300, 600);
                this.lastHeight += randomDistanceY;//此时lastHeight是新元素底部高度
                newOb = instantiate(this.element01);
                randomDistanceX = math.randomRange(ElementData.element01.left, ElementData.element01.right);
                newOb.setPosition(randomDistanceX, this.lastHeight + ElementData.element01.height / 2);
                newOb.setParent(this.node);
                this.lastHeight += ElementData.element01.height;//此时lastHeight是新元素顶部高度
                break;
            case 2:
                randomDistanceY = math.randomRange(300, 600);
                this.lastHeight += randomDistanceY;//此时lastHeight是新元素底部高度
                newOb = instantiate(this.element02);
                randomDistanceX = math.randomRange(ElementData.element02.left, ElementData.element02.right);
                newOb.setPosition(randomDistanceX, this.lastHeight + ElementData.element02.height / 2);
                newOb.setParent(this.node);
                this.lastHeight += ElementData.element02.height;//此时lastHeight是新元素顶部高度
                break;
            case 3:
                randomDistanceY = math.randomRange(300, 600);
                this.lastHeight += randomDistanceY;//此时lastHeight是新元素底部高度
                newOb = instantiate(this.element03);
                randomDistanceX = math.randomRange(ElementData.element03.left, ElementData.element03.right);
                newOb.setPosition(randomDistanceX, this.lastHeight + ElementData.element03.height / 2);
                newOb.setParent(this.node);
                this.lastHeight += ElementData.element03.height;//此时lastHeight是新元素顶部高度
                break;
            default :
                console.warn("create new element idx is NAN-----")
                break;
        }

        return newOb;
    }

}


