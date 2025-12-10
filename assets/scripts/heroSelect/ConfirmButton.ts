import { _decorator, Component, Graphics, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ConfirmButton')
export class ConfirmButton extends Component {
    start() {
        this.initMask();
    }

    update(deltaTime: number) {
        
    }

    initMask() {
        const gra = this.node.getComponent(Graphics)
        gra.roundRect(-100, -50, 200, 100, 50)
        gra.fill()
    }
}


