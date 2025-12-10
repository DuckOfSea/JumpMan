import { _decorator, Animation, Component, Graphics, Node, Sprite, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UnlockRandomButton')
export class UnlockRandomButton extends Component {
    

    start() {
        this.initMask();
    }

    update(deltaTime: number) {
        
    }

    initMask() {
        const gra = this.node.getComponent(Graphics)
        gra.roundRect(-200, -100, 400, 200, 50)
        gra.fill()
    }

    playRefuseAnimation() {
        tween(this.node)
            .to(0.1, {position : new Vec3(this.node.x + 10, this.node.y, 0)})
            .to(0.1, {position : new Vec3(this.node.x - 10, this.node.y, 0)})
            .to(0.1, {position : new Vec3(this.node.x + 10, this.node.y, 0)})
            .to(0.1, {position : new Vec3(this.node.x - 10, this.node.y, 0)})
            .to(0.1, {position : new Vec3(this.node.x, this.node.y, 0)})
            .start();
    }

}


