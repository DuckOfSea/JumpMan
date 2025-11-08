import { Size } from "cc";

export enum LocalStorageItems {
    CURRENT_HERO_INDEX ='currentHeroIndex',
    MUSIC_VOLUME = 'musicVolume',
    EFFECT_VOLUME = 'effectVolume',
    SCORE_01 = 'Score01',
    SCORE_02 = 'Score02',
    SCORE_03 = 'Score03',
    YUANBAO_NUM = 'yuanbaoNum',
    ITEM_UNLOCK_DATA = 'itemUnlockData',
}

export enum GroupNum {
    DEFAULT = 1,
    PLAYER = 2,
    OBSTACLE = 4,
    SPINE = 8,
    ITEM = 16,
}

export const G_VIEW_SIZE = new Size(720, 1280);

export enum GameStatus {
    WAIT_TO_START = 1,
    SETTING_PAUSE = 2,
    GAMING = 3,
    GAME_OVER = 4,
    SHOWING_SCOREBOARD = 5,
}

export const ElementData = {
    element01: {
        left : -360,
        right : 360,
        height : 50,
    },
    element02: {
        left : -360,
        right : 360,
        height : 500,
    },
    element03: {
        left : -360,
        right : 360,
        height : 600,
    },
}