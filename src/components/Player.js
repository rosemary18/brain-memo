import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../types'
import SoundPlayer from 'react-native-sound-player'

let listenerID

const Player = () => {

    // Variables & state

    const [state, setState] = useContext(GlobalContext)

    // Handlers

    Player.play = (name, type, play = true) => {

        if (name && type) {
            SoundPlayer?.stop?.()
            try {
                SoundPlayer.loadSoundFile(name, type)
                SoundPlayer.setVolume(state.volume)
                listenerID = SoundPlayer.addEventListener('FinishedPlaying', Player.stop)
                state.music && SoundPlayer.play?.()
            } catch (e) {
                Player.stop?.()
                console.log(`Cannot load the sound file`, e)
            }
        }
    }

    Player.stop = () => {

        SoundPlayer?.stop?.()

        try {
            SoundPlayer.loadSoundFile("backsound", "mp3")
            SoundPlayer.setVolume(state.volume)
            listenerID = SoundPlayer.addEventListener('FinishedPlaying', SoundPlayer.play)
            state.music && SoundPlayer.play?.()
        } catch (e) {
            console.log(`Cannot load the sound file`, e)
        }
    }

    // Effects

    useEffect(() => {

        try {
            SoundPlayer.loadSoundFile("backsound", "mp3")
            SoundPlayer.setVolume(state.volume)
        } catch (e) {
            console.log(`Cannot load the sound file`, e)
        }

    }, [])
    
    useEffect(() => {
        
        console.log("state changed ...")
        if (state.music) {
            SoundPlayer.play?.()
            if (!listenerID) listenerID = SoundPlayer.addEventListener('FinishedPlaying', () => SoundPlayer.play?.())
        } else {
            if (listenerID) {
                listenerID?.remove?.()
                listenerID = null
            }
            SoundPlayer.stop?.()
        }

        SoundPlayer.setVolume(state.volume)
    }, [state])

    // Returns
    
    return null
}

export default Player