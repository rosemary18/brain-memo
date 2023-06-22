import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { HEIGHT, WIDTH } from '../../types'
import { COLORS, FONTS, IMG_AVATAR_1 } from '../../assets'
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const ModalLoading = () => {

    // States & Variables

    const [loading, setLoading] = useState(false) 

    const load = useSharedValue(0)

    const loadAnimateStyle = useAnimatedStyle(() => {

        const transformInterpolate = interpolate(
            load.value,
            [0, 1],
            [-(WIDTH/2), 0]
        )
        
        return {
            ...styles.load,
            transform: [{ translateX: transformInterpolate }]
        }
    })

    // Handlers

    const handlerHide = () => {

        'worklet';

        load.value = 0
        runOnJS(setLoading)(false)
    }

    ModalLoading.show = (value = 3000) => {
        
        setLoading(true)
        load.value = 0
        load.value = withTiming(1, { duration: value }, handlerHide)
    }
    
    ModalLoading.hide = handlerHide
    
    // Effects

    // Renders

    return (
        <Modal 
            style={styles.modal}
            isVisible={loading}
            animationInTiming={300}
            animationOutTiming={300}
            backdropOpacity={0.3}
            animationIn='fadeIn'
            animationOut='fadeOut'
            statusBarTranslucent={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            deviceHeight={HEIGHT} >
            <Image source={IMG_AVATAR_1} style={styles.img} />
            <View style={styles.loadContainer}>
                <Animated.View style={loadAnimateStyle} />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        flex: 1,
        backgroundColor: COLORS.SECONDARY
    },
    img: {
        height: 80,
        width: 80
    },
    loadContainer: {
        height: 8,
        width: WIDTH * .5,
        borderRadius: 100,
        backgroundColor: COLORS.WHITE1 + "80",
        marginVertical: 28,
        overflow: "hidden"
    },
    load: {
        height: "100%",
        width: "100%",
        borderRadius: 100,
        backgroundColor: COLORS.WHITE,
        transform: [{translateX: -100}]
    }
})

export default ModalLoading
