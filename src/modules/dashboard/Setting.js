import Slider from '@react-native-community/slider'
import React, { useContext, useEffect } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, IC_CHECK, IC_CHECK_ACTIVE, IC_MUSIC, IC_VOLUME, Styles } from '../../assets'
import { GlobalContext } from '../../types'
import AsyncStorage from '@react-native-async-storage/async-storage'

let xf = 0

const Setting = ({ navigation }) => {

    // States & variables

    const [state, setState] = useContext(GlobalContext)

    const insets = useSafeAreaInsets()

    // Handlers

    const handlerSetVolume = (volume) => setState({...state, volume})

    const handlerSetMusic = () => {
        setState({ ...state, music: !state?.music })
        if (state?.music) handlerXF()
    }

    const handlerXF = () => xf += 1
    
    const handlerStartOver = () => {

        AsyncStorage.removeItem('USER')
        navigation?.navigate('LANDING_SCREEN')
    }

    // Effects

    // Renders

    useEffect(() => {

        
    }, [])

    return (
        <View style={[Styles.container, { padding: 12 }]}>
            <View style={styles.row}>
                <Image source={IC_VOLUME} style={styles.music} resizeMode="contain" />
                <Text style={[Styles.semiBold1, { color: COLORS.GRAY_DARK, marginHorizontal: 12 }]}>Volume</Text>
                <View style={{ flex: 1, paddingLeft: 16 }}>
                    <Slider
                        minimumValue={0}
                        maximumValue={1}
                        value={state.volume}
                        onValueChange={handlerSetVolume}
                        minimumTrackTintColor={COLORS.GREEN}
                        maximumTrackTintColor={COLORS.WHITE2}
                        tapToSeek
                        />
                </View>
            </View>
            <View style={styles.row}>
                <Image source={IC_MUSIC} style={styles.music} resizeMode="contain" />
                <Text style={[Styles.semiBold1, { color: COLORS.GRAY_DARK, marginHorizontal: 12 }]}>Musik</Text>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <TouchableOpacity activeOpacity={.7} onPress={handlerSetMusic}>
                        <Image source={state.music ? IC_CHECK_ACTIVE : IC_CHECK} style={styles.music} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>
            { xf >= 7 && <Text style={[Styles.semiBold1, { color: COLORS.GRAY_DARK, textAlign: "center", margin: 12 }]} onPress={handlerStartOver}>Main baru</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        minHeight: 40,
        margin: 12,
        marginHorizontal: 24,
        alignItems: "center"
    },
    music: {
        height: 24,
        width: 24
    }
})

export default Setting