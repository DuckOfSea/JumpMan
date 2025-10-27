import { _decorator, Camera, Component, director, HeightField, Label, labelAssembler, Node, Slider } from 'cc';
import { gp } from './GlobalProperties';
import { GameStatus, LocalStorageItems } from '../Constants';
import { TapToStart } from './TapToStart';
import { AudioManager } from '../AudioManager';
const { ccclass, property } = _decorator;

@ccclass('UIControoler')
export class UIController extends Component {
    @property(Camera)
    camera : Camera = null;
    @property(Node)
    settingUI : Node = null;
    @property(Slider)
    musicSlider : Slider = null;
    @property(Slider)
    soundEffectSlider : Slider = null;
    @property(AudioManager)
    audioManager : AudioManager = null;
    @property(Node)
    yuanbaoUI : Node = null;
    @property(Node)
    heightUI : Node = null;

    changeYuanbaoTimer : number = 0;
    savedChangeYuanbaoNum : number = 0;
    isChangingYuanbao : boolean = false;


    protected onLoad(): void {
        this.audioManager = director.getScene().getComponentInChildren(AudioManager);
    }
    
    start() {
        this.camera = this.node.getParent().getComponentInChildren(Camera);
        this.settingUI = this.node.getChildByName("SettingUI");
        this.settingUI.active = false;
        const sliders = this.settingUI.getComponentsInChildren(Slider);
        for (const index in sliders) {
            if (sliders[index].node.name == 'MusicSlider') {
                this.musicSlider = sliders[index];
            } else if (sliders[index].node.name == 'SoundEffectSlider') {
                this.soundEffectSlider = sliders[index];
            }
        }
        this.yuanbaoUI = this.node.getChildByName('YuanbaoUI');
        this.yuanbaoUI.getChildByName('ChangeYuanbao').active = false;
        const yuanbaoLabel = this.yuanbaoUI.getChildByName('YuanbaoNum').getComponent(Label);
        const yuanbaoNum = Number(localStorage.getItem(LocalStorageItems.YUANBAO_NUM) ? 
            localStorage.getItem(LocalStorageItems.YUANBAO_NUM) : '0');
        console.log("yuanbao num =   " + yuanbaoNum);
        gp.yuanbaoNum = yuanbaoNum;
        yuanbaoLabel.string = yuanbaoNum.toString();
        this.heightUI = this.node.getChildByName('HeightUI');
        this.hideHeightUI();
    }

    update(dt: number) {
        this.node.setPosition(this.camera.node.position);
        if (this.isChangingYuanbao) {
            this.changeYuanbaoTimer += dt;
            if (this.changeYuanbaoTimer > 2) {
                this.isChangingYuanbao = false;
                this.yuanbaoUI.getChildByName('ChangeYuanbao').active = false;
                this.yuanbaoUI.getChildByName('YuanbaoNum').getComponent(Label).string = gp.yuanbaoNum.toString();
                this.savedChangeYuanbaoNum = 0;
            }
        }
        
        
    }


    clickSettingButton() {
        if (gp.gameStatus == GameStatus.SETTING_PAUSE) {
            return;
        }
        gp.gameStatus = GameStatus.SETTING_PAUSE;
        console.log("setting button")

        let musicVolume = this.audioManager.musicVolume;
        let effectVolume = this.audioManager.effectVolume;
        this.musicSlider.progress = musicVolume;
        this.soundEffectSlider.progress = effectVolume;

        this.settingUI.active = true;
        this.settingUI.on(Node.EventType.TOUCH_START, () => {console.log("touch  setting ui")}, this)
    }

    clickSettingOkButton() {
        this.settingUI.active = false;
        const tapToStartUI = this.node.getParent().getComponentInChildren(TapToStart);
        if (tapToStartUI == null || tapToStartUI.node.active) {
            gp.gameStatus = GameStatus.WAIT_TO_START;
        } else {
            gp.gameStatus = GameStatus.GAMING;
        }
        
        this.settingUI.off(Node.EventType.TOUCH_START, () => {console.log("touch  setting ui")}, this)
        //更新音量设置
        this.audioManager.uploadVolume();

        console.log("setting ok");
    }

    onMusicVolumeChange(slider : Slider) {
        this.audioManager.updateMusicVolume(slider.progress);
    }

    onEffectVolumeChange(slider : Slider) {
        this.audioManager.updateEffectVolume(slider.progress);
    }

    changeYuanbaoNum(num : number) {
        this.changeYuanbaoTimer = 0;
        this.isChangingYuanbao = true;
        const changeYuanbao = this.yuanbaoUI.getChildByName('ChangeYuanbao')
        //如果当前已有待修改金额，则跟新的金额加到一起
        changeYuanbao.active = true;
        this.savedChangeYuanbaoNum += num;
        const changeYuanbaoLabel = changeYuanbao.getComponent(Label);
        let tmpString = "";
        if (this.savedChangeYuanbaoNum > 0) {
            tmpString = "+";   
        }
        tmpString += this.savedChangeYuanbaoNum.toString();
        changeYuanbaoLabel.string = tmpString;
        
        gp.yuanbaoNum += num;
        localStorage.setItem(LocalStorageItems.YUANBAO_NUM, gp.yuanbaoNum.toString());
    }

    changeMaxHeight(height : number) {
        const heightLabel = this.heightUI.getChildByName('MaxHeight').getComponent(Label);
        heightLabel.string = height.toString();
    }

    showHeightUI() {
        this.heightUI.active = true;
        const heightLabel = this.heightUI.getChildByName('MaxHeight').getComponent(Label);
        heightLabel.string = '0';
    }

    hideHeightUI() {
        this.heightUI.active = false;
    }
}


