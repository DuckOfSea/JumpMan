import { _decorator, Component, Graphics, Node, NodeEventType, ScrollView, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrollViewController')
export class ScrollViewController extends Component {
    
    scrollView : ScrollView = null;

    heroes : Node[] = [];

    
    start() {
        this.scrollView = this.node.getComponent(ScrollView);
        this.heroes = this.node.getChildByName('ScrollViewContent').children;
        
    }

    protected onDestroy(): void {
        this.node.off('scrolling', this.onScrolling, this);
    }

    update(deltaTime: number) {

    }

    onScrolling() {
        
    }


}


