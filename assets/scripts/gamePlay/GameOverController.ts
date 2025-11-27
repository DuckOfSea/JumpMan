import { __private, _decorator, Camera, Color, color, Component, director, EventTouch, Input, input, Label, Node, Sprite, tween, v3 } from 'cc';
import { HighestScoreButton} from './HighestScoreButton';
import { UIController } from './UIController';
const { ccclass, property } = _decorator;

@ccclass('GameOverController')
export class GameOverController extends Component {
    
    @property(Sprite)
    background : Sprite = null;
    @property(Label)
    gameOverLabel : Label = null;
    @property(Camera)
    camera : Camera = null;
    @property(HighestScoreButton)
    highestScoreNode : HighestScoreButton = null;

    UINode : UIController = null;

    settleScoreNode : Node = null;
    getYuanbaoNode : Node = null;
    needChangeYuanbaoNum : number = 0;




    protected onLoad(): void {
        
        this.background = this.node.getComponentInChildren(Sprite);
        this.gameOverLabel = this.node.getComponentInChildren(Label);
        this.camera = this.node.getParent().getComponentInChildren(Camera);
        this.highestScoreNode = this.node.getParent().
            getComponentInChildren(HighestScoreButton);
        this.UINode = this.node.getParent().getComponentInChildren(UIController);
        this.settleScoreNode = this.node.getChildByName('Score');
        this.getYuanbaoNode = this.node.getChildByName('GetYuanbao');
    }
    
    protected start(): void {

    }

    protected onDestroy(): void {

    }

    showGameOver(maxHeight : number) {
        this.node.active = true;
        this.node.position = this.camera.node.position;
        this.UINode.hideHeightUI();
        // this.node.setSiblingIndex(this.node.parent.children.length - 1);

        const scoreNumLabel = this.settleScoreNode.getChildByName('ScoreNumber')?.getComponent(Label);
        scoreNumLabel.string = maxHeight.toString();
        //updateScore
        this.highestScoreNode.updateScore(maxHeight);
        //updateYuanbao
        this.needChangeYuanbaoNum = Math.floor(maxHeight / 2000)// > 0 ? Math.floor(maxHeight / 2000) : 0;
        const yuanbaoLabel = this.getYuanbaoNode.getChildByName('YuanbaoNum').getComponent(Label);
        yuanbaoLabel.string = this.needChangeYuanbaoNum.toString();
        this.UINode.changeYuanbaoNum(this.needChangeYuanbaoNum);

        if (this.background) {
            this.background.color = new Color(0, 0, 0, 200);
        }
        if (this.gameOverLabel) {
            this.gameOverLabel.node.scale = v3(1, 1, 1);
            this.gameOverLabel.color = new Color(255, 255, 255, 255);
        }
    }

    hideGameOver() {
        this.node.active = false;
    }

    returnButtonClick() {
        console.log("game over return button touch, needchange yuanbao num     " + this.needChangeYuanbaoNum)
        
        this.hideGameOver();
        director.resume();
        director.loadScene('gamePlay');
    }

}


