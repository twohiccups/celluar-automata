// themes.ts

export type ThemeName =
    | 'Basic'
    | 'Matrix'
    | 'Monochrome'
    | 'German'
    | 'Pastel'
    | 'Fire'
    | 'Autumn';

export type ColorTheme = string[]; // Can contain up to 9 colors

export const themes: Record<ThemeName, ColorTheme> = {
    Basic: [
        '#000000',
        '#ffffff',
        '#999999',
        '#444444',
        '#DDDDDD',
        '#666666',
    ],
    Matrix: [

        '#000000', // background
        '#00FF00', // main neon green
        '#007700', // dark green (for trail)
        '#CCFFCC',
        '#003300', // very dark green (fade)
        '#00CC00', // mid-bright green (highlight)
    ],
    Monochrome: [
        '#51b2f9',
        '#000000',
        '#000000',
        '#000000',
        '#000000',
        '#000000',
    ],
    German: [
        '#000000',
        '#dd0000',
        '#ffce00',
        '#000000',
        '#dd0000',
        '#ffce00',
    ],
    Pastel: [
        '#ffadad',
        '#ffd6a5',
        '#fdffb6',
        '#caffbf',
        '#9bf6ff',
        '#a0c4ff',
    ],
    Fire: [
        '#F25C00',
        '#F89B00',
        '#E4D000',
        '#E24200',
        '#E80800',
        '#C2A500',
    ],
    Autumn: [
        '#A3A901',
        '#F2D670',
        '#FEECD4',
        '#F89F05',
        '#E36005',
        '#831212',
    ],
};

export const themeNames = Object.keys(themes) as ThemeName[];
