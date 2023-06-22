import { Platform } from "react-native"

const GELOGICA = Platform.OS == "android" ? "Geologica" : "GeologicaRoman"

export const FONTS = {
    REGULAR: `${GELOGICA}-Regular`, 
    SEMIBOLD: `${GELOGICA}-SemiBold`, 
    BOLD: `${GELOGICA}-Bold`, 
    EXTRABOLD: `${GELOGICA}-ExtraBold`, 
}

export const COLORS = {
    WHITE: "#FFFFFF",
    BLACK: "#000000",
    PRIMARY: "#146C94",
    SECONDARY: "#19A7CE",
    ACCENT: "#AFD3E2",
    WHITE1: "#F5F5F5",
    WHITE2: "#F6F1F1",
    TRANSPARENT: "transparent",
    GRAY_DARK: "#767676",
    GRAY_SOFT: "#DCDCDC",
    GRAY_TEXT: "#858585",
    GRAY1: '#E0E0E0',
    GRAY2: '#A0A0A0',
    GRAY5: '#ADADAD',
    GRAY3: '#EEEEEE',
    GRAY4: '#D4D4D4',
    GRAY6: '#858585',
    GRAY7: '#BEC2C4',
    GRAY8: '#6A6A6A',
    GRAY9: '#878787',
    GRAY10: '#CECECE',
    GREEN: '#94D675',
    RED: "#F44336",
    RED_LIGHT: "#FFDCE5",
}