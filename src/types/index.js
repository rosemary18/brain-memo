import { Dimensions } from "react-native";
import { isTablet } from "react-native-device-info";


export * from "./store"
export const HEIGHT = Dimensions.get('screen').height,
    WIDTH = Dimensions.get('screen').width,
    IS_TABLET = isTablet(),
    MARGIN_TAB = WIDTH/4