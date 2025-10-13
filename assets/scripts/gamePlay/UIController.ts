import { _decorator, Camera, Component, director, Label, labelAssembler, Node, Slider } from 'cc';
import { gp } from './GlobalProperties';
import { LocalStorageItems } from '../Constants';
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
        const yuanbaoLabel = this.yuanbaoUI.getChildByName('YuanbaoNum').getComponent(Label);
        const yuanbaoNum = Number(localStorage.getItem(LocalStorageItems.YUANBAO_NUM) ? 
            localStorage.getItem(LocalStorageItems.YUANBAO_NUM) : '0');
        console.log(yuanbaoNum);
        gp.yuanbaoNum = yuanbaoNum;
        yuanbaoLabel.string = yuanbaoNum.toString();
    }

    update(deltaTime: number) {
        this.node.setPosition(this.camera.node.position);
    }


    clickSettingButton() {
        if (gp.settingPause) {
            return;
        }
        let musicVolume = this.audioManager.musicVolume;
        let effectVolume = this.audioManager.effectVolume;
        this.musicSlider.progress = musicVolume;
        this.soundEffectSlider.progress = effectVolume;

        this.settingUI.active = true;

        gp.settingPause = true;
        console.log("setting button")
    }

    clickSettingOkButton() {
        this.settingUI.active = false;
        gp.settingPause = false;
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
        let newYuanbaoNum = num + this.getYuanbaoNum();
        if (typeof newYuanbaoNum != 'number' || isNaN(newYuanbaoNum)) {
            console.log("--------warning--------" + newYuanbaoNum + isNaN(newYuanbaoNum))
            newYuanbaoNum = num;
        }
        this.showYuanbaoNumChange(newYuanbaoNum)
        localStorage.setItem(LocalStorageItems.YUANBAO_NUM, newYuanbaoNum.toString());
    }

    getYuanbaoNum() : number {
        const yuanbaoLabel = this.yuanbaoUI.getChildByName('YuanbaoNum').getComponent(Label);
        return Number(yuanbaoLabel.string)
    }

    showYuanbaoNumChange(newYuanbaoNum : number) {
        const yuanbaoLabel = this.yuanbaoUI.getChildByName('YuanbaoNum').getComponent(Label);
        yuanbaoLabel.string = newYuanbaoNum.toString();
    }
}


