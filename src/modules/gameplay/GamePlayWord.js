import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { COLORS, IC_NOTIFICATION, Styles } from '../../assets'
import { GlobalContext } from '../../types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { ModalGameResult } from '../../components'
import { shuffle } from '../../utils'

let timeID, timeScore = 0

const GamePlayWord = ({ navigation, route }) => {

    const { params } = route

    // States & variables

    const [state, setState] = useContext(GlobalContext)
    const [openAll, setOpenAll] = useState(false)
    const [play, setPlay] = useState(false)
    const [time, setTime] = useState(0)
    const [word, setWord] = useState(Array(params?.word?.length).fill(""))
    const [shuffled, setShuffled] = useState([...params?.word?.split(''), ...Array(Math.floor(params?.word?.length*.1))])

    const insets = useSafeAreaInsets()

    // Handlers

    const handlerPlay = () => {

        setPlay(true)
        setTime(params?.seconds)
        setShuffled([...shuffle(shuffled)])
    }

    const handlerOpen = (value) => {

        let currentIndex = null
        let correct = false

        word.map((item, index) => (!item && currentIndex == null) && (currentIndex = index))

        if (value == params?.word?.[currentIndex]) {
            word[currentIndex] = value
            setWord([...word])
            correct = true
        } else {

            setOpenAll(true)
            setState({
                ...state,
                heart: state.heart - 1,
            })
            
            timeID = setTimeout(() => {
                navigation?.navigate("DASHBOARD_NAVIGATOR", { screen: "DASHBOARD_SCREEN" })
                ModalGameResult.show(false)
            }, 1500);
        }
        
        return correct
    }

    const handlerWin = () => {

        let set = true
        let addHeart = state?.heart < 5

        word.map((item, index) => (!item) && (set = false))

        if (set) {

            let type = timeScore < 5 ? 3 : timeScore < 8 ? 1 : 0

            setState({
                ...state,
                heart: Math.min(5, state?.heart+1),
                level: {
                    ...state.level,
                    word: Math.max(params?.level, state.level?.word)
                }
            })

            timeID = setTimeout(() => {
                navigation?.navigate("DASHBOARD_NAVIGATOR", { screen: "DASHBOARD_SCREEN" })
                ModalGameResult.show(true, addHeart, false, type)
            }, 1500);
        }
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

    useEffect(handlerWin, [word])

    // Renders

    const renderInstructions = () => (
        <View style={styles.instructionContainer}>
            <Image source={IC_NOTIFICATION} style={styles.instuctionIcon} resizeMode="contain" />
            <Text style={[Styles.semiBold, { textAlign: "center", padding: 24 }]}>Kata: [ {params?.word} ]</Text>
            <Text style={[Styles.semiBold1, { textAlign: "center", paddingHorizontal: 24 }]}>PETUNJUK</Text>
            <View style={{ padding: 24 }}>
                <Text style={[Styles.regular, { textAlign: "center", marginVertical: 4, color: COLORS.GRAY_DARK }]}>{`1. Perhatikan kota kotak abjad dan ingat baik baik.`}</Text>
                <Text style={[Styles.regular, { textAlign: "center", marginVertical: 4, color: COLORS.GRAY_DARK }]}>{`2. Kamu akan diberikan waktu ${params?.seconds} detik untuk mengingat kotak kotak abjad.`}</Text>
                <Text style={[Styles.regular, { textAlign: "center", marginVertical: 4, color: COLORS.GRAY_DARK }]}>{`3. Urutkan abjad sesuai kata yang diminta.`}</Text>
            </View>
            <TouchableOpacity
                style={styles.btn}
                onPress={handlerPlay}
				activeOpacity={.7}>
				<Text style={Styles.bold2White}>Go!</Text>
			</TouchableOpacity>
        </View>
    )

    const renderWord = (word, index) => (
        <View style={{margin: 4}} key={index?.toString?.()}>
            <Text style={Styles.bold2}>{word || "_"}</Text>
        </View>
    )

    const renderCard = (item, index) => <Card
        open={(time > 0) || openAll}
        item={item}
        index={index}
        onOpen={handlerOpen}
        visible={item ? true : false}
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


                            <View style={styles.key}>
                                <Text style={Styles.semiBold1}>{params?.word}</Text>
                            </View>
                            {
                                time > 0 ? (
                                    <View style={styles.timeContainer}>
                                        <Text style={[Styles.semiBold1, { color: COLORS.RED }]}>{`00:0${time}`}</Text>
                                    </View>
                                ) : (
                                    <View style={styles.formWord}>
                                        { word?.map(renderWord) }
                                    </View>                                        
                                )
                            }

                        </View>
                        <View style={[styles.canvas, { borderColor: (time%2) == 0 ? COLORS.GRAY10 : COLORS.RED }]}>
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

const Card = ({ open = false, onOpen, visible = true, item, index }) => {

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
        setTimeout(async () => {
            const correct = await onOpen?.(item)
            setIncorrect(!correct)
        }, 0);
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
            disabled={opened || !visible}
            key={index?.toString?.()}
            onPress={handlerOpen} activeOpacity={.7}>
            <Animated.View style={[styles.front, animateFront]} />
            <Animated.View
                style={[styles.back, animateBack, incorrect == true && { backgroundColor: COLORS.RED_LIGHT, borderColor: COLORS.RED }, incorrect == false && { borderColor: COLORS.GREEN }]}>
                <Text style={[Styles.bold3, incorrect == true && { color: COLORS.RED }, incorrect == false && { color: COLORS.GREEN }]}>{item}</Text>
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
        paddingHorizontal: 6,
        marginTop: 12
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
        minHeight: 200,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.GRAY10,
        backgroundColor: COLORS.WHITE,
        margin: 16,
        marginTop: 12,
        padding: 12
    },
    cardContainer: {
        height: 70,
        width: 70,
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
        borderColor: COLORS.SECONDARY,
        borderWidth: 1.5,
        borderRadius: 5,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        transform: [{ rotateY: "180deg" }],
    },
    lists: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly"
    }
})

export default GamePlayWord