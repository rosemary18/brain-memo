import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { COLORS, IMG_HEART, Styles } from '../../assets'
import { GlobalContext } from '../../types'
import { differenceInSeconds } from 'date-fns'
import { useIsFocused } from '@react-navigation/native'

let intervalId

const HeartBadge = ({isTime = false}) => {

    // States & Variables

    const [state, setState] = useContext(GlobalContext)
    const [seconds, setSeconds] = useState(0)
    const isFocused = useIsFocused()

    // Handlers

    const handlerUpdateTime = () => {

        setSeconds(v => {
            if (v == 0) done = true
            return Math.max((v-1), 0)
        })
    }

    // Effects

    useEffect(() => {

        console.log("check ...")
        if (isTime) {
            if (state.stackHeart?.length > 0) setSeconds(differenceInSeconds(new Date(state.stackHeart[0]), new Date()))
            else setSeconds(0)
        }
    }, [state, isFocused])

    useEffect(() => {

        if (seconds > 0 && !intervalId) {
            clearInterval(intervalId)
            intervalId = setInterval(handlerUpdateTime, 1000)
        } else if (seconds == 0) {
            clearInterval(intervalId)
            intervalId = null
        }
    }, [seconds])
    
    // Renders

    const time = {
        seconds: parseInt(seconds % 60),
        minutes: parseInt(seconds / 60, 10) % 60,
        hours: parseInt(seconds / (60 * 60), 10) % 24,
        days: parseInt(seconds / (60 * 60 * 24), 10),
    };

    return (
        <View style={styles.heartContainer}>
            <Image source={IMG_HEART} style={styles.heart} resizeMode="contain" />
            <Text style={Styles.semiBold}>{state?.heart}</Text>

            {
                ((seconds > 0) && isTime) && (
                    <View style={styles.containerTime}>
                        <Text style={[Styles.regularTiny, { color: COLORS.SECONDARY, fontSize: 8 }]}>{`0${time.minutes}`.slice(-2)} : {`0${time.seconds}`.slice(-2)}</Text>
                    </View>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    heartContainer: {
        minHeight: 24,
        borderRadius: 5,
        minWidth: 40,
        marginHorizontal: 12,
        borderWidth: 1.5,
        borderColor: COLORS.GRAY10,
        alignItems: "flex-end",
        paddingLeft: 24,
        paddingRight: 4,
        justifyContent: "center"
    },
    heart: {
        height: 35,
        width: 35,
        marginHorizontal: 4,
        position: "absolute",
        left: -20,
        top: -8
    },
    containerTime: {
        position: "absolute",
        zIndex: 9,
        right: 0,
        bottom: -14,
        left: 0,
        justifyContent: "center",
        alignItems: "flex-end"
    }
})

export default HeartBadge
