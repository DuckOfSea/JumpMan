import { _decorator, Component, Label, Node } from 'cc';
import { LocalStorageItems } from '../Constants';
import { gp } from './GlobalProperties';
const { ccclass, property } = _decorator;

@ccclass('HighestScoreButton')
export class HighestScoreButton extends Component {
    
    @property(Node)
    scoreNode01 : Node = null;
    @property(Node)
    scoreNode02 : Node = null;
    @property(Node)
    scoreNode03 : Node = null;
    scoreBoard : Node = null;
    
    start() {
        this.scoreBoard = this.node.getChildByName('ScoreBoard');
        this.scoreNode01 = this.scoreBoard.getChildByName('Score01');
        this.scoreNode02 = this.scoreBoard.getChildByName('Score02');
        this.scoreNode03 = this.scoreBoard.getChildByName('Score03');
        this.scoreBoard.active = false;
        this.node.on(Node.EventType.TOUCH_START, this.showScoreBoard, this);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.showScoreBoard, this);
    } 

    updateScore(curScore : number) {
        let score01 = localStorage.getItem(LocalStorageItems.SCORE_01) ? 
            Number(localStorage.getItem(LocalStorageItems.SCORE_01)) : 0;
        let score02 = localStorage.getItem(LocalStorageItems.SCORE_01) ? 
            Number(localStorage.getItem(LocalStorageItems.SCORE_02)) : 0;
        let score03 = localStorage.getItem(LocalStorageItems.SCORE_01) ? 
            Number(localStorage.getItem(LocalStorageItems.SCORE_03)) : 0;
        
        console.log(curScore + "  " + score01 + "  " + score02 + "  " + score03);
        
        if (curScore > score03) {
            score03 = curScore;
            if (curScore > score02) {
                score03 = score02;
                score02 = curScore;
                if (curScore > score01) {
                    score02 = score01;
                    score01 = curScore;
                }
            }
        }

        console.log(curScore + "  " + score01 + "  " + score02 + "  " + score03);
        localStorage.setItem(LocalStorageItems.SCORE_01, score01.toString());
        localStorage.setItem(LocalStorageItems.SCORE_02, score02.toString());
        localStorage.setItem(LocalStorageItems.SCORE_03, score03.toString());
    }

    showScoreBoard() {
        if (gp.settingPause) {
            return;
        }
        let score01 = localStorage.getItem(LocalStorageItems.SCORE_01) ? 
            localStorage.getItem(LocalStorageItems.SCORE_01) : "0";
        let score02 = localStorage.getItem(LocalStorageItems.SCORE_01) ? 
            localStorage.getItem(LocalStorageItems.SCORE_02) : "0";
        let score03 = localStorage.getItem(LocalStorageItems.SCORE_01) ? 
            localStorage.getItem(LocalStorageItems.SCORE_03) : "0";
        const scoreNode01 = this.scoreBoard.getChildByName('Score01');
        const scoreNode02 = this.scoreBoard.getChildByName('Score02');
        const scoreNode03 = this.scoreBoard.getChildByName('Score03');
        scoreNode01.getChildByName('ScoreNumber').getComponent(Label).string = score01;
        scoreNode02.getChildByName('ScoreNumber').getComponent(Label).string = score02;
        scoreNode03.getChildByName('ScoreNumber').getComponent(Label).string = score03;
        this.scoreBoard.active = true;
        console.log("showScoreBoard" + this.scoreBoard.active)
        gp.settingPause = true;
    }

    returnButtonClick() {
        gp.settingPause = false;
        this.scoreBoard.active = false;
    }
}


