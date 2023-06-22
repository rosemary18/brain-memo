import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated'
import { Shadow } from 'react-native-shadow-2'
import { COLORS, Styles } from '../../assets'

const SwitchBar = ({ container, barWrapper, textStyle, bars = [], title, trackBar = COLORS.SECONDARY, backgroundBar = COLORS.WHITE, index = 0, onChange }) => {

    // States & Variables

    const [activeIndex, setActiveIndex] = useState(0)
    const [barWidth, setBarWidth] = useState(0) 

    const translateX = useSharedValue(0)
    const opacity = useSharedValue(1);
    const animateStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value
    }))

    // Handlers

    const handlerOnLayout = (e) => setBarWidth(e.nativeEvent.layout?.width || 0)
    
    const handlerSetActiveIndex = idx => {
        
        setActiveIndex(idx)
        let value = idx * ((barWidth-8) / bars?.length);
        opacity.value = 1
        opacity.value = withRepeat(withTiming(0.7, {duration: 300}), 2, true)
        translateX.value = withDelay(100, withTiming(value, { duration: 420 }))
        onChange?.(idx)
    }

    // Effects

    useEffect(() => {
        handlerSetActiveIndex(index)
    }, [index])

    useEffect(() => {
        if (index > 0 && barWidth > 0) handlerSetActiveIndex(index)
    }, [barWidth])

    // Renders

    const renderLabel = (item, index) => {

        const onPress = () => handlerSetActiveIndex(index)
        
        return (
            <TouchableOpacity style={[styles.label]} activeOpacity={.7} key={index.toString()} onPress={onPress}>
                <Text style={[Styles.semiBold, textStyle, (activeIndex == index) && { color: COLORS.WHITE }]}>{item}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={[styles.container, container]}>
            {title?.length > 0 && <Text style={[TextStyles.smallSemiBold, {marginBottom: 4}]}>{title}</Text>}
            <Shadow stretch={true} distance={2} style={{borderRadius: 4}} startColor="#0000001a" offset={[.5, .5]}>
                <View style={[styles.barWrapper, { backgroundColor: backgroundBar }, barWrapper]}>
                    <View style={styles.barsContainer} onLayout={handlerOnLayout}>
                        <Animated.View style={[styles.bar, { width: ((barWidth-8)/bars?.length) || 0 }, animateStyle, { backgroundColor: trackBar }]} />
                    </View>
                    <View style={styles.content}> 
                        { bars?.map(renderLabel) }
                    </View>
                </View>
            </Shadow>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: 40
    },
    barWrapper: {
        backgroundColor: COLORS.WHITE,
        height: 48,
        borderRadius: 3
    },
    barsContainer: {
        position: 'absolute',
        zIndex: -1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    bar: {
        backgroundColor: COLORS.SECONDARY,
        flex: 1,
        margin: 4,
        borderRadius: 3
    },
    content: {
        flexDirection: 'row',
        flex: 1,
    },
    label: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SwitchBar
