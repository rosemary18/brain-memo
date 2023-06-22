import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ANIMALS, COLORS, IC_NOTIFICATION, Styles } from '../../assets'
import { GlobalContext } from '../../types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { ModalGameResult } from '../../components'
import { shuffle } from '../../utils'

let timeID, timeScore = 0

const GamePlayImage = ({ navigation, route }) => {

    const { params } = route

    // States & variables

    const [state, setState] = useContext(GlobalContext)
    const [image, setImage] = useState({})
    const [openAll, setOpenAll] = useState(false)
    const [disableAll, setDisableAll] = useState(false)
    const [play, setPlay] = useState(false)
    const [time, setTime] = useState(0)
    const [shuffled, setShuffled] = useState([])

    const insets = useSafeAreaInsets()

    // Handlers

    const handlerPlay = () => {

        let _shuffled = shuffle(ANIMALS?.slice())
        const selectedImage = _shuffled?.splice?.(params?.option, 1)?.[0]
        const options = _shuffled?.slice?.(-(params?.option-1))

        const shuff = [...Array(Math.floor(params?.option*.3)), ...options, selectedImage]

        setPlay(true)
        setTime(params?.seconds)
        setImage(selectedImage)
        setShuffled([...shuffle(shuff)])
    }

    const handlerOpen = (item) => {

        setDisableAll(true)
        
        setTimeout(() => setOpenAll(true), 500);

        setTimeout(() => {
            
            if (item?.name == image?.name) handlerWin()
            else {
    
                setState({
                    ...state,
                    heart: state.heart - 1,
                })
                
                timeID = setTimeout(() => {
                    navigation?.navigate("DASHBOARD_NAVIGATOR", { screen: "DASHBOARD_SCREEN" })
                    ModalGameResult.show(false)
                }, 1500);
            }
        }, 1000);
        
        return item?.name == image?.name
    }

    const handlerWin = () => {

        let addHeart = state?.heart < 5

        let type = timeScore < 5 ? 3 : timeScore < 8 ? 1 : 0

        setState({
            ...state,
            heart: Math.min(5, state?.heart+1),
            level: {
                ...state.level,
                image: Math.max(params?.level, state.level?.image)
            }
        })

        timeID = setTimeout(() => {
            navigation?.navigate("DASHBOARD_NAVIGATOR", { screen: "DASHBOARD_SCREEN" })
            ModalGameResult.show(true, addHeart, true, type)
        }, 1500);
    }

    const handlerCountScoreTime = () => {

        clearInterval(timeID)
        timeScore = 0
        timeID = setInterval(() => timeScore += 1, 1000);
    }

    // Effects

    useEffect(() => {

        if (time > 0) timeID = setTimeout(() => setTime(time - 1), 1000);
        else if (timeID) handlerCountScoreTime()

        return () => clearInterval(timeID)
    }, [time])

    // Renders

    const renderInstructions = () => (
        <View style={styles.instructionContainer}>
            <Image source={IC_NOTIFICATION} style={styles.instuctionIcon} resizeMode="contain" />
            <Text style={[Styles.regularSmall, { textAlign: "center", padding: 24, paddingBottom: 0 }]}>PETUNJUK</Text>
            <Text style={[Styles.regularSmall, { textAlign: "center", padding: 24, color: COLORS.GRAY_DARK }]}>
                {`Perhatikan gambar dalam kotak.\nKamu akan diberikan waktu ${params?.seconds} detik untuk mengingat gambar gambar. \nPilih kotak gambar seperti yang diminta.`}
            </Text>
            <TouchableOpacity
                style={styles.btn}
                onPress={handlerPlay}
				activeOpacity={.7}>
				<Text style={Styles.bold2White}>Go!</Text>
			</TouchableOpacity>
        </View>
    )

    const renderCard = (item, index) => <Card
        open={(time > 0) || openAll}
        item={item}
        index={index}
        onOpen={handlerOpen}
        visible={item ? true : false}
        disableAll={disableAll}
        key={index?.toString?.()}/>

    return (
        <ScrollView
            style={Styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}>
            {
                !play ? renderInstructions() : (
                    <>
                        <View style={styles.head}>

                            {
                                time > 0 && (
                                    <View style={styles.timeContainer}>
                                        <Text style={[Styles.semiBold1, { color: COLORS.RED }]}>{`00:0${time}`}</Text>
                                    </View>
                                )
                            }

                            <View style={[styles.key, time > 0 && {opacity: 0}]}>
                                <Image source={image?.image} style={{height: 80, width: 80, borderRadius: 5, marginBottom: 8}} />
                            </View>
                            <Text style={[Styles.regular, { padding: 8 }, time > 0 && {opacity: 0}]}>{image?.name}</Text>

                        </View>
                        <View style={styles.canvas}>
                            <View style={styles.lists}>
                                {shuffled.map(renderCard)}
                            </View>
                        </View>       
                    </>
               )
            }
        </ScrollView>
    )
}

const Card = ({ open = false, onOpen, visible = true, item, index, disableAll }) => {

    // States & variables

    const [opened, setOpened] = useState(open)
    const [incorrect, setIncorrect] = useState(null)

    const spin = useSharedValue(0)

    const animateFront = useAnimatedStyle(() => {
        const spinVal = interpolate(spin.value, [0, 1], [0, 180]);
        return {
            transform: [
                {
                    rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
                },
            ],
        };
    }, []);
    
    const animateBack = useAnimatedStyle(() => {
        const spinVal = interpolate(spin.value, [0, 1], [180, 360]);
        return {
            transform: [
                {
                    rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
                },
            ],
        };
    }, []);

    // Handlers

    const handlerOpen = () => {
        spin.value = 1,
        setOpened(true),
        setTimeout(() => {
            let correct = onOpen?.(item)
            setIncorrect(!correct)
        }, 300);
    }

    // Effects

    useEffect(() => {

        spin.value = open ? 1 : 0
        setOpened(open)
    }, [open])

    // Renders

    return (
        <TouchableOpacity
            style={[styles.cardContainer, !visible && { opacity: 0 }]}
            disabled={opened || disableAll || !visible}
            key={index?.toString?.()}
            onPress={handlerOpen} activeOpacity={.7}>
            <Animated.View style={[styles.front, animateFront]} />
            <Animated.View style={[styles.back, animateBack, incorrect == true && { backgroundColor: COLORS.RED_LIGHT, borderColor: COLORS.RED }, incorrect == false && { borderColor: COLORS.GREEN }]}>
                <Image source={item?.image} style={{height: 90, width: 90, borderRadius: 5}} resizeMode="cover" />
            </Animated.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    instructionContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        paddingVertical: "20%"
    },
    instuctionIcon: {
        height: 60,
        width: 60
    },
	btn: {
		borderRadius: 5,
		backgroundColor: COLORS.SECONDARY,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16,
		minHeight: 40,
		marginVertical: 12
    },
    head: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: 40,
        margin: 12
    },
    key: {
        padding: 6,
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY10
    },
    timeContainer: {
        borderRadius: 5,
        borderColor: COLORS.RED,
        borderWidth: 1,
        padding: 4,
        position: "absolute",
        right: 12,
        paddingHorizontal: 6,
    },
    formWord: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        borderColor: COLORS.GRAY10,
        borderWidth: 1,
        padding: 6,
        paddingHorizontal: 8,
        marginTop: 10
    },
    canvas: {
        minHeight: 400,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.GRAY10,
        backgroundColor: COLORS.WHITE,
        margin: 16,
        marginTop: 12,
        padding: 8
    },
    cardContainer: {
        height: 100,
        width: 100,
        borderRadius: 5,
        margin: 6,
    },
    front: {
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.PRIMARY,
        borderRadius: 5,
        backfaceVisibility: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    back: {
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderWidth: 1.5,
        borderRadius: 5,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        transform: [{ rotateY: "180deg" }]
    },
    lists: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly"
    }
})

export default GamePlayImage