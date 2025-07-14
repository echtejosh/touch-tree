import '@mui/x-data-grid/themeAugmentation';
import { createTheme, colors, alpha } from '@mui/material';
import { getCurrentTheme } from 'presentation/themes/themeSelect';

export const touchTreeLogoPalette = ['#25bc89', '#43aaa8', '#258baf', '#256dbc', '#222222'];

export const editorColorsPalette = {
    page: {
        background: '#262a2d',
        font: '#cccccc',
        highlight: '#25bcb4',
    },
    header: {
        background: '#1c2224',
        font: '#cccccc',
    },
    footer: {
        background: '#1c2224',
        font: '#cccccc',
    },
    card: {
        background: '#f3f3f3',
        font: '#cccccc',
    },
    separator: '#f3f3f3',
} as const;

const theme = getCurrentTheme();

export const themePalette = {
    primary: {
        main: theme.theme,
    },
    tertiary: {
        main: 'rgb(248,113,246)',
    },
    background: {
        light: 'rgb(248,248,248)',
        main: colors.common.white,
        dark: theme.themeDark,
    },
    border: {
        main: '#eaeaea',
        light: 'rgb(246,246,246)',
    },
    text: {
        main: 'rgb(34,34,34)',
        light: 'rgba(34,34,34,0.5)',
        lighter: 'rgb(232,232,232)',
    },
    icon: {
        main: 'rgb(34,34,34)',
        light: 'rgba(34,34,34,0.37)',
    },
    hover: {
        main: 'rgba(255,255,255,0.08)',
        light: 'rgba(255,255,255,0.3)',
        lighter: 'rgba(255,255,255,0.1)',
    },
    highlight: {
        main: 'rgba(37,188,180,0.27)',
    },
    error: {
        main: 'rgb(253,46,80)',
        light: 'rgba(253,46,80,0.87)',
    },
} as const;

export const mainTheme = createTheme({
    palette: {
        primary: themePalette.primary,
        text: {
            primary: themePalette.text.main,
        },
        action: {
            hover: themePalette.background.light,
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: 'montserrat,sans-serif',
        h1: {
            fontFamily: 'inter',
            fontWeight: 700,
            fontSize: 32,
        },
        h2: {
            fontFamily: 'inter',
            fontWeight: 700,
            fontSize: 28,
        },
        h3: {
            fontFamily: 'inter',
            fontWeight: 700,
            fontSize: 18,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    lineHeight: 1,
                    height: '100dvh',
                },
                a: {
                    textDecoration: 'none !important',
                },
                '&.recharts-text.recharts-cartesian-axis-tick-value': {
                    fontSize: 12,
                },
                '&.recharts-rectangle.recharts-tooltip-cursor': {
                    fill: themePalette.border.main,
                },
                '&.recharts-tooltip-wrapper': {
                    zIndex: '9999',
                },
                '&.recharts-default-tooltip': {
                    borderColor: `${themePalette.border.main} !important`,
                    borderRadius: 8,
                },
                '&.recharts-sector:focus': {
                    outline: 'none !important',
                    stroke: 'none',
                },
                '::selection': {
                    background: themePalette.highlight.main,
                },
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: themePalette.background.light,
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(15,15,17,0.15)',
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: 'rgba(15,15,17,0.2)',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: 16,
                    border: 'none',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    // background: themePalette.background.light,
                },
            },
        },
        MuiTableBody: {
            styleOverrides: {
                root: {
                    '.MuiTableRow-root': {
                        // borderBottom: `1px solid ${themePalette.border.main}`,

                        '&:hover': {
                            backgroundColor: themePalette.background.light,
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: themePalette.text.main,
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: 'currentColor',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: themePalette.text.main,

                    '&.Mui-checked .MuiSvgIcon-root': {
                        color: themePalette.primary.main,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
                label: {
                    padding: 0,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: themePalette.border.main,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontSize: 16,
                },
                input: {
                    '&::placeholder': {
                        color: themePalette.text.main,
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    fontSize: 18,
                    borderColor: themePalette.border.main,
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: 14,
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                shrink: {
                    fontSize: 18,
                    fontWeight: 500,
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    color: themePalette.text.main,
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: 'none !important',
                    fontWeight: 600,
                    color: themePalette.primary.main,
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '& .MuiTouchRipple-root': {
                        display: 'none',
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    color: themePalette.text.main,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    whiteSpace: 'nowrap',
                    textTransform: 'unset',
                    boxShadow: 'none !important',
                    justifyContent: 'center',
                },
                contained: {
                    color: colors.common.white,

                    '&:hover': {
                        backgroundColor: alpha(themePalette.primary.main, 0.9),
                    },

                    '& svg:not(.MuiCircularProgress-svg)': {
                        color: colors.common.white,
                    },
                },
                sizeSmall: {
                    fontSize: 14,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    '& .MuiTouchRipple-root': {
                        display: 'none',
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                fullWidth: true,
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: themePalette.background.dark,
                    color: colors.common.white,
                },
                arrow: {
                    color: themePalette.background.dark,
                },
            },
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    color: themePalette.icon.main,

                    '& .MuiIconButton-root': {
                        color: 'inherit',
                    },
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 700,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export const menuTheme = createTheme(mainTheme, {
    palette: {
        background: {
            default: themePalette.background.dark,
            paper: themePalette.background.dark,
        },
    },
    typography: {
        fontFamily: 'Montserrat,sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 400,
                    textTransform: 'unset',
                    justifyContent: 'left',
                    background: 'none',
                    color: 'white',

                    '&:hover': {
                        color: 'white',
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                root: {
                    width: 270,
                },
                paper: {
                    border: 'none !important',
                    width: 270,
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    img: {
                        width: 150,
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '15px',
                    padding: '8px 12px',
                },
            },
        },
    },
});
