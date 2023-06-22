import { useIsFocused } from '@react-navigation/native'
import React, { useContext, useEffect } from 'react'
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AVATARS, COLORS, IC_COG, Styles } from '../../assets'
import { GlobalContext } from '../../types'
import { HeartBadge } from '../views'

const DashboardHeader = ({
    navigation,
    route,
    style,
    textStyle,
    containerStyle
}) => {
    
    const { params } = route

    // States & Variables

    const [state, setState] = useContext(GlobalContext)

    const insets = useSafeAreaInsets()
    const isFocused = useIsFocused()

    // Handlers
    
    const handlerNavigateSetting = () => navigation?.navigate?.("SETTING_SCREEN")

    // Effects

    useEffect(() => {

        if (isFocused) StatusBar.setBarStyle('dark-content')
    }, [isFocused])
    
    // Renders

    const renderBadge = () => {

        const allLevel = state?.level?.word + state?.level?.image
        let title = "Pintar!"

        if (allLevel >= 10) title = "Cerdas!"
        if (allLevel >= 20) title = "Hebat!"
        if (allLevel >= 30) title = "Pro!"
        if (allLevel >= 40) title = "Jenius!"

        if (allLevel < 5) return null
        return <Text style={[Styles.bold2, { color: COLORS.GREEN }, textStyle]} numberOfLines={1}>({title})</Text>
    }

    return (
        <View style={{paddingTop: insets.top}}>
            <View style={[styles.container, containerStyle]}>
                <Image source={AVATARS[state?.user?.avatar]} style={styles.avatar} />
                <View style={[styles.content, style]}>
                    <Text style={[Styles.bold3, { color: COLORS.GRAY_DARK }, textStyle]} numberOfLines={1}>{state?.user?.name} {renderBadge()}</Text>                    
                </View>
                <HeartBadge isTime={true} />
                <TouchableOpacity activeOpacity={.7} onPress={handlerNavigateSetting}>
                    <Image source={IC_COG} style={styles.setting} resizeMode="contain" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 100,
        overflow: "hidden",
        marginHorizontal: 8,
        borderWidth: 1.5,
        borderColor: COLORS.SECONDARY
    },
    setting: {
        height: 24,
        width: 24,
        marginHorizontal: 4
    },
    container: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 4
    }
})

export default DashboardHeader
