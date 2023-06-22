import React, { useContext, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, IC_MEDAL, IC_PLAY_ACTIVE, Styles } from '../../assets'
import { DashboardHeader, ModalEmptyHeart, ModalLoading, SwitchBar } from '../../components'
import { GlobalContext } from '../../types'
import { LEVEL_IMAGES, LEVEL_WORDS } from '../../types/level'
import { keyExtractor } from '../../utils'

const Dashboard = (props) => {

    const { navigation, route } = props

    // States & variables

    const [state, setState] = useContext(GlobalContext)
    const [modal, setModal] = useState(null)
    const [word, setWord] = useState(true)
    const [levels, setLevels] = useState([])

    const insets = useSafeAreaInsets()

    // Handlers

    const handlerCloseModal = () => setModal(null)

    const handlerChangeGame = (e) => {

        setWord(e == 0)
        setLevels(e == 0 ? LEVEL_WORDS : LEVEL_IMAGES)
    }

    const handlerCheckProgress = (item) => {

        const { level } = state

        let available = false
        let completed = false
        let icon = IC_PLAY_ACTIVE

        if (word) {
            if (item?.level <= (level?.word+1)) available = true
            if (item?.level <= (level?.word)) completed = true
            if (available) icon = !(item?.level <= level?.word) ? IC_PLAY_ACTIVE : IC_MEDAL
        } else {
            if (item?.level <= (level?.image+1)) available = true
            if (item?.level <= (level?.image)) completed = true
            if (available) icon = !(item?.level <= level?.image) ? IC_PLAY_ACTIVE : IC_MEDAL
        }

        return {
            available,
            completed,
            icon
        }
    }

    const handlerPlay = (item) => () => {

        if (state.heart > 0) {
            ModalLoading.show()
            setTimeout(() => {
                navigation.navigate('GAMEPLAY_NAVIGATOR', {
                    screen: word ? "PLAY_WORD_SCREEN" : "PLAY_IMAGE_SCREEN",
                    params: {
                        title: `${word ? "Kata" : "Gambar"} - Level ${item?.level}`,
                        ...item
                    }
                })
            }, 350);
        } else setModal(0)
    }

    // Effects

    // Renders

    const renderItem = ({ item, index }) => { 

        const progress = handlerCheckProgress(item)

        return (
            <TouchableOpacity
                style={[styles.item, progress.available && { backgroundColor: COLORS.WHITE }, (progress.available && !progress.completed) && {borderColor: COLORS.GREEN}]}
                onPress={handlerPlay(item)}
                disabled={!progress.available}
                activeOpacity={.7}>
                <View style={{flex: 1, paddingHorizontal: 12}}>
                    <Text style={[Styles.semiBold1, { color: (progress.available && !progress.completed) ? COLORS.GREEN : COLORS.GRAY_DARK }]}>Level {`${index+1}`}</Text>
                </View>
                { progress.available && <Image source={progress.icon} style={[styles.check, !progress.completed && { height: 20 }]} resizeMode="contain" /> }
            </TouchableOpacity>
        )
    }

    return (
        <View style={Styles.container}>
            <ModalEmptyHeart isVisible={modal == 0} onClose={handlerCloseModal} />
            <DashboardHeader {...props} />
            <SwitchBar
                bars={["KATA", "GAMBAR"]}
                onChange={handlerChangeGame}
                textStyle={{color: COLORS.GRAY_DARK}}
                container={{margin: 12}} />
            <FlatList
                data={levels}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{padding: 6, paddingTop: 0, paddingBottom: insets.bottom+6}}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        borderRadius: 100,
        minHeight: 40,
        borderWidth: 1.2,
        borderColor: COLORS.GRAY10,
        margin: 6,
        backgroundColor: COLORS.GRAY3,
        flexDirection: "row",
        alignItems: "center"
    },
    check: {
        height: 24,
        width: 24,
        marginHorizontal: 10
    }
})

export default Dashboard