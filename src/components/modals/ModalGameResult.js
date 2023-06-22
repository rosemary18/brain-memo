import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import { COLORS, IC_STAR, IMG_HEART, IMG_SAD, Styles } from '../../assets'
import { HEIGHT } from '../../types'
import Player from '../Player'

const ModalGameResult = () => {

    // States & Variables

    const [show, setShow] = useState(false)
    const [success, setSuccess] = useState(false)
    const [addHeart, setAddHeart] = useState(false)
    const [isImage, setIsImage] = useState(false)
    const [type, setType] = useState(0)

    // Handlers

    const handlerHide = () => setShow(false)

    ModalGameResult.show = (success = false, addHeart = false, image = false, type = 0) => {

        if (success) Player.play("win", "wav")
        else Player.play("lose", "wav")
        
        setShow(true)
        setSuccess(success),
        setAddHeart(addHeart)
        setIsImage(image)
        setType(type)
    }
    
    ModalGameResult.hide = handlerHide
    
    // Effects

    // Renders

    const renderSuccess = () => (
        <>
            <Image source={IC_STAR} style={styles.img} resizeMode="contain" />
            <Text style={[Styles.bold3, { color: COLORS.GREEN, marginTop: 24 }]}>{type == 0 ? "Cerdas!" : type == 1? "Pro!" : "Jenius!"}</Text>
            <Text style={styles.descText}>{isImage ? "Yeay, Kamu memilih gambar yang benar!" : "Yeay, selamat kamu berhasil menyusun kotak dengan benar!"}</Text>
            {
                addHeart && (
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Text style={Styles.regularSmall}>+1</Text>
                        <Image source={IMG_HEART} style={{height: 16, width: 16, marginLeft: 4}} resizeMode="contain" />
                    </View>
                )
            }
        </>
    )

    const renderFailed = () => (
        <>
            <Image source={IMG_SAD} style={styles.img} />
            <Text style={styles.descText}>Waduh, kamu memilih kotak yang salah. Coba lagi ya... </Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={Styles.regularSmall}>-1</Text>
                <Image source={IMG_HEART} style={{height: 16, width: 16, marginLeft: 4}} resizeMode="contain" />
            </View>
        </>
    )

    return (
        <Modal 
            style={styles.modal}
            isVisible={show}
            animationInTiming={300}
            animationOutTiming={300}
            backdropOpacity={0.9}
            backdropColor={COLORS.WHITE}
            animationIn='fadeIn'
            animationOut='fadeOut'
            statusBarTranslucent={true}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={handlerHide}
            onBackdropPress={handlerHide}
            deviceHeight={HEIGHT} >
            { success ? renderSuccess() : renderFailed() }
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        flex: 1,
        padding: 24
    },
    img: {
        height: 80,
        width: 80
    },
    descText: {
        ...Styles.regular,
        textAlign: "center",
        padding: 24
    }
})

export default ModalGameResult
