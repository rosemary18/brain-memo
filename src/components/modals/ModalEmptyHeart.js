import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import { COLORS, IMG_HEART, Styles } from '../../assets'
import { GlobalContext, HEIGHT } from '../../types'
import { differenceInSeconds } from 'date-fns'

let intervalId

const ModalEmptyHeart = ({isVisible, onClose}) => {

    // States & Variables

    const [state, setState] = useContext(GlobalContext)
    const [seconds, setSeconds] = useState(0)

    // Handlers

    const handlerOnClose = () => onClose?.()

    const handlerUpdateTime = () => {

        let done;

        setSeconds(v => {
            console.log(v)
            if (v == 0) done = true
            return Math.max((v-1), 0)
        })

        if (done) {
            clearInterval(intervalId)
            onClose?.()
        }
    }
    
    // Effects

    useEffect(() => {

        clearInterval(intervalId)

        if (isVisible) {
            if (state.stackHeart?.length > 0) {
                setSeconds(differenceInSeconds(new Date(state.stackHeart[0]), new Date()))
                intervalId = setInterval(handlerUpdateTime, 1000);
            }
        }

        return () => clearInterval(intervalId)

    }, [isVisible])

    // Renders

    const time = {
        seconds: parseInt(seconds % 60),
        minutes: parseInt(seconds / 60, 10) % 60,
        hours: parseInt(seconds / (60 * 60), 10) % 24,
        days: parseInt(seconds / (60 * 60 * 24), 10),
    };

    return (
        <Modal 
            style={{flex: 1, margin: 0}}
            isVisible={isVisible}
            animationInTiming={300}
            animationOutTiming={300}
            backdropOpacity={0.8}
            backdropColor={COLORS.WHITE}
            animationIn='fadeIn'
            animationOut='fadeOut'
            statusBarTranslucent={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={handlerOnClose}
            onBackdropPress={handlerOnClose}
            deviceHeight={HEIGHT}>
            <TouchableOpacity style={styles.modal} activeOpacity={.9} onPress={handlerOnClose}>
                <Image source={IMG_HEART} style={styles.img} resizeMode="contain" />
                <Text style={[Styles.regular, { color: COLORS.GRAY_DARK, textAlign: "center", padding: 24 }]}>Energi kamu habis, tunggu beberapa saat lagi yaa</Text>
                <Text style={[Styles.bold2, { textAlign: "center", padding: 24 }]}>{`0${time.minutes}`.slice(-2)} : {`0${time.seconds}`.slice(-2)}</Text>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        flex: 1,
    },
    img: {
        height: 80,
        width: 80
    }
})

export default ModalEmptyHeart
