import { _decorator, Component, instantiate, math, Node, Prefab, random, UITransform } from 'cc';
import { gp } from './GlobalProperties';
import { PlayerController } from './PlayerController';
import { ElementData, G_VIEW_SIZE, GameStatus, LocalStorageItems } from '../Constants';
const { ccclass, property } = _decorator;

@ccclass('ElementController')
export class ElementController extends Component {
    
    @property([Prefab])
    elements01 : Prefab[] = [];
    @property([Prefab])
    elements02 : Prefab[] = [];
    @property([Prefab])
    elements03 : Prefab[] = [];
    @property(Prefab)
    element02_tutorial : Prefab = null;

    lastHeight : number = G_VIEW_SIZE.height / 2;
    currBoardNum : number = 0;
    
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
            if (randomNum < this.currBoardNum) {   
                if (this.player.isIgnore) {
                    newOb = this.createNewBoard();
                }
                newOb = this.createNewIgnore();
            } else if (randomNum < this.currBoardNum * 3) {   
                newOb = this.createNewYuanbao();
            } else { 
                newOb = this.createNewBoard();
            }
            
            this.elements.push(newOb);
        }
        
    }

    initElements() {
        while (this.lastHeight < G_VIEW_SIZE.height * 2) {
            const newOb = this.createNewBoard();
            this.elements.push(newOb);
        }
        const needIgnoreTutorial = localStorage.getItem(LocalStorageItems.NEED_GAME_PLAY_TUTORIAL) ? 
                    localStorage.getItem(LocalStorageItems.NEED_GAME_PLAY_TUTORIAL) : 'yes';
        console.log("--------  needIgnoreTutorial = " + needIgnoreTutorial)
        if (needIgnoreTutorial == 'yes') {
            console.log("--------  needIgnoreTutorial")
            const newOb = this.createNewTutorialIgnore();
            this.elements.push(newOb);
        }
    }

    createNewBoard() : Node {
        const randomNum = math.randomRange(0, 100);
        let newOb = this.elements01[0];
        let elementData = ElementData.element01.e01;
        if (randomNum < 20) {

        } else if (randomNum < 40) {
            if (this.lastHeight > 10000) {
                newOb = this.elements01[1];
                elementData = ElementData.element01.e02;
            }
        } else if (randomNum < 60) {
            if (this.lastHeight > 20000) {
                newOb = this.elements01[2];
                elementData = ElementData.element01.e03;
            }
        } else if (randomNum < 70) {
            if (this.lastHeight > 30000) {
                newOb = this.elements01[3];
                elementData = ElementData.element01.e04;
            }
        } else if (randomNum < 80) {
            if (this.lastHeight > 40000) {
                newOb = this.elements01[4];
                elementData = ElementData.element01.e05;
            }
        } else {
            if (this.lastHeight > 50000) {
                newOb = this.elements01[5];
                elementData = ElementData.element01.e06;
            }
        }
        let randomDistanceX = math.randomRange(elementData.left, elementData.right);
        let randomDistanceY = math.randomRange(300, 600);//randomDistanceY是上一个元素底部到新元素底部高度
        this.lastHeight += randomDistanceY;//此时lastHeight是新元素底部高度
        let newObPrefab = instantiate(newOb);
        newObPrefab.setPosition(randomDistanceX, this.lastHeight + elementData.height / 2);
        newObPrefab.setParent(this.node);
        this.lastHeight += elementData.height;//此时lastHeight是新元素顶部高度

        this.currBoardNum++;
        return newObPrefab;
    }

    createNewIgnore() : Node {
        const randomNum = math.randomRange(0, 100);
        let newOb = instantiate(this.elements02[0]);
        let elementData = ElementData.element02.e01;
        if (randomNum < 30) {

        } else if (randomNum < 70) {
            newOb = instantiate(this.elements02[1]);
            elementData = ElementData.element02.e02;
        } else {
            newOb = instantiate(this.elements02[2]);
            elementData = ElementData.element02.e03;
        }
        
        let randomDistanceX = math.randomRange(elementData.left, elementData.right);
        let randomDistanceY = math.randomRange(300, 600);
        this.lastHeight += randomDistanceY;//此时lastHeight是新元素底部高度
        
        newOb.setPosition(randomDistanceX, this.lastHeight + elementData.height / 2);
        newOb.setParent(this.node);
        this.lastHeight += elementData.height;//此时lastHeight是新元素顶部高度

        this.currBoardNum = 0;
        return newOb;
    }

    createNewYuanbao() : Node {
        const randomNum = math.randomRange(0, 100);
        let newOb = instantiate(this.elements03[0]);
        let elementData = ElementData.element02.e01;
        if (randomNum < 30) {

        } else if (randomNum < 70) {
            newOb = instantiate(this.elements03[1]);
            elementData = ElementData.element03.e02;
        } else {
            newOb = instantiate(this.elements03[2]);
            elementData = ElementData.element03.e03;
        }

        let randomDistanceX = math.randomRange(elementData.left, elementData.right);
        let randomDistanceY = math.randomRange(200, 400);
        this.lastHeight += randomDistanceY;//此时lastHeight是新元素底部高度
        newOb.setPosition(randomDistanceX, this.lastHeight + elementData.height / 2);
        newOb.setParent(this.node);
        this.lastHeight += elementData.height;//此时lastHeight是新元素顶部高度

        this.currBoardNum = 0;
        return newOb;
    }


    createNewTutorialIgnore() {
        let newOb = instantiate(this.element02_tutorial);
        let elementData = ElementData.element02.tutorial;
        let randomDistanceX = math.randomRange(elementData.left, elementData.right);
        let randomDistanceY = math.randomRange(300, 600);
        this.lastHeight += randomDistanceY;//此时lastHeight是新元素底部高度
        
        newOb.setPosition(randomDistanceX, this.lastHeight + elementData.height / 2);
        newOb.setParent(this.node);
        this.lastHeight += elementData.height;//此时lastHeight是新元素顶部高度

        this.currBoardNum = 0;
        return newOb;
    }
}


