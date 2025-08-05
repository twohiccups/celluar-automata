// themes.ts

export type ThemeName = 'Default' | 'Warm' | 'Cool' | 'Nature' | 'Retro';

export type ColorTheme = string[]; // Must contain exactly 6 colors

export const themes: Record<ThemeName, ColorTheme> = {
    Default: ['#000000', '#ffffff', '#444444', '#888888', '#bbbbbb', '#dddddd'],
    Warm: ['#330000', '#802000', '#cc3300', '#ff6600', '#ff9933', '#ffcc99'],
    Cool: ['#001f33', '#004466', '#006699', '#3399cc', '#66ccff', '#cceeff'],
    Nature: ['#2c2c1b', '#4b5d16', '#7ba03f', '#b2d56d', '#dff4a3', '#f7ffe0'],
    Retro: ['#1e1e1e', '#3c3c3c', '#7b9e87', '#e6d690', '#ffc57e', '#ff8882'],
};

export const themeNames = Object.keys(themes) as ThemeName[];
