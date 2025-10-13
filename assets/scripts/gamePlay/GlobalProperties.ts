import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GlobalProperties')
export class GlobalProperties extends Component {
    private static instance : GlobalProperties;

    width : number = 0;
    height : number = 0;
    public settingPause : boolean = false;
    public isGameStart : boolean = false;
    public score : number = 0;
    public yuanbaoNum : number = 0;

    start() {
        
    }

    static getInstance() {
        if (GlobalProperties.instance == null) {
            GlobalProperties.instance = new GlobalProperties();
        }
        return GlobalProperties.instance;
    }
}

export const gp = GlobalProperties.getInstance();


