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
    NEED_GAME_PLAY_TUTORIAL = 'needGamePlayTutorial',
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
    TUTORIAL = 6,
}

export const ElementData = {
    element01: {
        e01: {
            left : -360,
            right : 360,
            height : 50,
        },
        e02: {
            left : -360,
            right : 360,
            height : 50,
        },
        e03: {
            left : -360,
            right : 360,
            height : 300,
        },
        e04: {
            left : -360,
            right : 360,
            height : 500,
        },
        e05: {
            left : -360,
            right : 360,
            height : 500,
        },
        e06: {
            left : -360,
            right : 360,
            height : 50,
        },
    },
    element02: {
        tutorial : {
            left : 0,
            right : 0,
            height : 400,
        },
        e01: {
            left : -360,
            right : 360,
            height : 500,
        },
        e02: {
            left : -360,
            right : 360,
            height : 550,
        },
        e03: {
            left : -360,
            right : 360,
            height : 700,
        }
        
    },
    element03: {
        e01: {
            left : -360,
            right : 360,
            height : 600,
        },
        e02: {
            left : -360,
            right : 360,
            height : 500,
        },
        e03: {
            left : -360,
            right : 360,
            height : 900,
        },
    },
}