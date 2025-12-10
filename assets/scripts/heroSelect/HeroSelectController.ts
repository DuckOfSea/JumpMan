import { _decorator, Animation, animation, AnimationClip, Color, Component, director, easing, EventTouch, instantiate, JsonAsset, math, Node, Prefab, resources, ScrollView, Sprite, Vec2, Vec3 } from 'cc';
import { LocalStorageItems } from '../Constants';
import { gp } from '../gamePlay/GlobalProperties';
import { UnlockRandomButton } from './UnlockRandomButton';
import { AudioManager } from '../AudioManager';
import { UIController } from '../gamePlay/UIController';
const { ccclass, property } = _decorator;

@ccclass('HeroSelectController')
export class HeroSelectController extends Component {

    scrollView : ScrollView = null;
    UINode : UIController = null;
    currentSelectedIndex : number = 0;
    currentSelectedItem : Node = null;
    showUnlockItem : Node = null;
    itemUnlockData : number[] = [1, 0, 0, 0, 0,   0, 0, 0, 0, 0];
    @property(AudioManager)
    audioManager : AudioManager = null;
    @property([Prefab])
    herosPrefab : Prefab[] = [];

    start() {
        this.currentSelectedIndex = Number((localStorage.getItem(LocalStorageItems.CURRENT_HERO_INDEX) 
            ? localStorage.getItem(LocalStorageItems.CURRENT_HERO_INDEX) : '0'));
        console.log("start currentHeroIndex = " + this.currentSelectedIndex);
        this.scrollView = this.node.getComponentInChildren(ScrollView);
        this.audioManager = director.getScene().getComponentInChildren(AudioManager);
        this.UINode = this.node.getComponentInChildren(UIController);
        this.showUnlockItem = this.node.getChildByName('ShowUnlockItem');
        this.showUnlockItem.active = false;
        const savedItemUnlockData = localStorage.getItem(LocalStorageItems.ITEM_UNLOCK_DATA);
        if (savedItemUnlockData) {
            this.itemUnlockData = JSON.parse(savedItemUnlockData);
        }
        
        // test
        // this.itemUnlockData = [1, 0, 0, 0, 0, 
        //                         0, 0, 0, 0, 0];
        this.init();
    }

    protected onDestroy(): void {
        localStorage.setItem(LocalStorageItems.ITEM_UNLOCK_DATA, JSON.stringify(this.itemUnlockData));
    }

    update(deltaTime: number) {
        
    }

    unlockRandomButton() {
        //如果钱不够
        if (gp.yuanbaoNum < 200) {
            const unlockRandomButton = this.node.getComponentInChildren(UnlockRandomButton);
            unlockRandomButton.playRefuseAnimation();
            this.audioManager.playSFX(3);
            return;
        }
        const len = this.itemUnlockData.length;
        let unlockNum = math.randomRangeInt(1, len);
        let unlockIndex = 0;
        for (let i = 0; i < 100; i++) {
            if (this.itemUnlockData[i % len] == 0) {
                unlockNum--;
                if (unlockNum == 0) {
                    unlockIndex = i % len;
                    break;
                }
            }
        }
        console.log("unlockIndex = " + unlockIndex);
        if (unlockIndex == 0) {//皮肤已经解锁完了
            console.log("皮肤解锁完了0.0")
            const unlockRandomButton = this.node.getComponentInChildren(UnlockRandomButton);
            unlockRandomButton.playRefuseAnimation();
            this.audioManager.playSFX(3);
            return;
        }
        this.UINode.changeYuanbaoNum(-200);
        this.itemUnlockData[unlockIndex] = 1;
        this.centerSelectedItem(unlockIndex);
        this.showUnlockItemAnimation(unlockIndex);
        this.scrollView.content.children[unlockIndex].getComponentInChildren(Sprite).color = Color.WHITE;
        localStorage.setItem(LocalStorageItems.ITEM_UNLOCK_DATA, JSON.stringify(this.itemUnlockData));
    }

    confirmButton() {
        localStorage.setItem(LocalStorageItems.CURRENT_HERO_INDEX, this.currentSelectedIndex.toString());
        console.log("confirm  hero index is " + this.currentSelectedIndex);
        director.loadScene('gamePlay');
    }

    init() {
        const scrollViewContent = this.scrollView.content;
        const items = scrollViewContent.children;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let border = item.getChildByName('border');
            let arrow = item.getChildByName('arrow');
            let sprite = item.getComponentInChildren(Sprite)
            if (i != this.currentSelectedIndex) {
                border.active = false;
                arrow.active = false;
            } else {
                this.currentSelectedItem = item;
            }

            if (this.itemUnlockData[i] == 0) {
                sprite.color = Color.BLACK;
            }

            item.on(Node.EventType.TOUCH_START, this.touchItem, this);
        }

        this.centerSelectedItem(this.currentSelectedIndex);
    }

    touchItem(event : EventTouch) {
        const targetItem = event.target as Node;
        const index = targetItem.getSiblingIndex();
        if (this.itemUnlockData[index] == 0) {
            return;
        }

        let border = targetItem.getChildByName('border');
        let arrow = targetItem.getChildByName('arrow');
        this.currentSelectedItem.getChildByName('border').active = false;
        this.currentSelectedItem.getChildByName('arrow').active = false;
        this.currentSelectedItem = targetItem;
        border.active = true;
        arrow.active = true;
        this.audioManager.playSFX(1)
        
        this.currentSelectedIndex = index;
        localStorage.setItem(LocalStorageItems.CURRENT_HERO_INDEX, index.toString());
    }

    centerSelectedItem(index : number) {
        const itemWidth = 200;
        const targetX = (index + 1) * itemWidth;
        const viewWidth = 720;
        const scrollX = targetX - (viewWidth / 2);
        console.log(scrollX + "  " + targetX )
        this.scrollView.scrollToOffset(new Vec2(scrollX, 0), 0.2, true)
    }

    showUnlockItemAnimation(unlockIndex : number) {
        this.showUnlockItem.active = true;
        this.audioManager.playBGM(2);
        const unlockItemAnim = this.showUnlockItem.getChildByName('UnlockItemAnim');
        unlockItemAnim.removeAllChildren();
        let newHero = instantiate(this.herosPrefab[unlockIndex]);
        newHero.parent = unlockItemAnim;
        const anim = unlockItemAnim.getComponent(Animation)
        anim.play('show_unlockitem_animation');
        this.showUnlockItem.off(Node.EventType.TOUCH_START, this.touchUnlockAnimation, this)
        this.showUnlockItem.on(Node.EventType.TOUCH_START, () => {}, this)
        setTimeout(() => {
            this.showUnlockItem.on(Node.EventType.TOUCH_START, this.touchUnlockAnimation, this)
            this.showUnlockItem.off(Node.EventType.TOUCH_START, this.doNothing, this)
        }, 3000);
        
    }

    touchUnlockAnimation(event : EventTouch) {
        const targetItem = event.target as Node;
        targetItem.active = false;
        this.audioManager.playBGM(1);
    }

    doNothing(event : EventTouch) {

    }
}


