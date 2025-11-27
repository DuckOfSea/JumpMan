import { _decorator, AudioClip, AudioSource, CCFloat, CCInteger, Component, director, Node } from 'cc';
import { LocalStorageItems } from './Constants';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioSource)
    private musicSource : AudioSource;
    @property([AudioSource])
    public effectSourcePool : AudioSource[] = [];
    @property(CCFloat)
    public musicVolume : number = 1.0;
    @property(CCFloat)
    public effectVolume : number = 1.0;
    @property(CCInteger)
    private effectSourcePoolIndex : number = 0;

    @property(AudioClip)
    bgm_game01 : AudioClip = null;
    @property(AudioClip)
    bgm_unlock : AudioClip = null;
    @property(AudioClip)
    bgm_ignore : AudioClip = null;
    @property(AudioClip)
    sfx_select : AudioClip = null;
    @property(AudioClip)
    sfx_tan : AudioClip = null;
    @property(AudioClip)
    sfx_refuse : AudioClip = null;
    @property(AudioClip)
    sfx_coin : AudioClip = null;


    start() {

    }

    protected onLoad(): void {
        console.log("audio onload");
        this.node.active = true;
        if (!this.node._persistNode) {            
            director.addPersistRootNode(this.node);
        }
        this.init();
    }

    protected onEnable(): void {
        //console.log("audiomanager on enable")
    }

    protected onDisable(): void {
        //console.log("audiomanager on disable")
    }

    init() {
        if (localStorage.getItem(LocalStorageItems.MUSIC_VOLUME)) {
            this.musicVolume = Number(localStorage.getItem(LocalStorageItems.MUSIC_VOLUME));
        } else {
            localStorage.setItem(LocalStorageItems.MUSIC_VOLUME, this.musicVolume.toString());
        }
        if (localStorage.getItem(LocalStorageItems.EFFECT_VOLUME)) {
            this.effectVolume = Number(localStorage.getItem(LocalStorageItems.EFFECT_VOLUME));
        } else {
            localStorage.setItem(LocalStorageItems.EFFECT_VOLUME, this.effectVolume.toString());
        }
        
    }


    playBGM(idx : number) {
        this.musicSource.stop();
        switch(idx) {
            case 1:
                this.musicSource.clip = this.bgm_game01;
                break;
            case 2:
                this.musicSource.clip = this.bgm_unlock;
                break;
            case 3:
                this.musicSource.clip = this.bgm_ignore;
                break;
            default:
                this.musicSource.clip = this.bgm_game01;
                break;
        }
        this.musicSource.loop = true;
        this.musicSource.volume = this.musicVolume * 0.5;
        this.musicSource.play();
    }

    playSFX(idx : number) {
        const effectSource = this.effectSourcePool[this.effectSourcePoolIndex];
        this.effectSourcePoolIndex = (this.effectSourcePoolIndex + 1) % 5;
        switch(idx) {
            case 1:
                effectSource.clip = this.sfx_select;
                break;
            case 2:
                effectSource.clip = this.sfx_tan;
                break;
            case 3:
                effectSource.clip = this.sfx_refuse;
                break;
            case 4:
                effectSource.clip = this.sfx_coin;
                break;
            default:
                break;
        }
        effectSource.volume = this.effectVolume;
        effectSource.play();
        
    }

    isplayingBGM01() {
        return this.musicSource.clip == this.bgm_game01;
    }

    stopBGM() {
        console.log("stop bgm")
        this.musicSource.stop();
    }

    protected onDestroy(): void {
    }

    updateMusicVolume(value : number) {
        this.musicVolume = value;
        this.musicSource.volume = value * 0.5;
    }

    updateEffectVolume(value : number) {
        for (const audioSource of this.effectSourcePool) {
            audioSource.volume = value;
        }
        this.effectVolume = value;
    }

    uploadVolume() {
        localStorage.setItem(LocalStorageItems.MUSIC_VOLUME, this.musicVolume.toString());
        localStorage.setItem(LocalStorageItems.EFFECT_VOLUME, this.effectVolume.toString());
    }
}
