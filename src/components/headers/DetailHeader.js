import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect } from 'react'
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, IC_HOME, Styles } from '../../assets'
import { GlobalContext } from '../../types'
import { HeartBadge } from '../views'

const DetailHeader = ({
    navigation,
    route,
    title,
    style,
    textStyle,
    containerStyle,
    heart = true
}) => {
    
    const { params } = route

    // States & Variables

    const [state, setState] = useContext(GlobalContext)

    const insets = useSafeAreaInsets()
    const isFocused = useIsFocused()

    // Handlers

    const handlerBackHome = () => navigation?.navigate('DASHBOARD_NAVIGATOR', {screen: "DASHBOARD_SCREEN"})

    // Effects

    useEffect(() => {

        if (isFocused) StatusBar.setBarStyle('dark-content')
    }, [isFocused])
    
    // Renders

    return (
        <View style={{paddingTop: insets.top, backgroundColor: COLORS.WHITE}}>
            <View style={[styles.container, containerStyle]}>
                <TouchableOpacity activeOpacity={.7} onPress={handlerBackHome} style={{marginLeft: 8}}>
                    <Image source={IC_HOME} style={styles.home} resizeMode="contain" />
                </TouchableOpacity>
                <View style={[styles.content, style]}>
                    <Text style={[Styles.semiBold1, { color: COLORS.GRAY_DARK }, textStyle]} numberOfLines={1}>{params?.title || title}</Text>
                </View>
                { heart && <HeartBadge /> }
                {params?.renderRight?.()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    home: {
        height: 24,
        width: 24
    }
})

export default DetailHeader
