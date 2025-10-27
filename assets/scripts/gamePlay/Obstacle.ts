import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component {
    
    @property
    public upperBoundary : number = 0;
    @property
    public lowerBoundary : number = 0;
    @property
    public height : number = 0;
    
    start() {
        const tansform = this.node.getComponent(UITransform);
        this.upperBoundary = this.node.position.y + tansform.contentSize.y / 2;
        this.lowerBoundary = this.node.position.y - tansform.contentSize.y / 2;
        this.height = tansform.contentSize.y;
    }


}


