import AsyncStorage from "@react-native-async-storage/async-storage"
import { addMinutes, differenceInMilliseconds, format, isAfter } from "date-fns"
const { createContext, useState, useEffect } = require("react")

let storeHeart, listenerHeart

const initialState = {
    user: null,
    level: {
        image: 0,
        word: 0,
    },
    heart: 5,
    volume: .5,
    music: false,
    stackHeart: []
}

export const GlobalContext = createContext()

export const Store = ({ children }) => {
    
    // States & variables

    const [state, setState] = useState(initialState)

    // Handlers

    const handlerListenHeart = () => {

        console.log("[HEART]: ADD 1 HEART ...")

        let heart = Math.min(5, storeHeart + 1)
        state.heart = heart
        state.stackHeart?.splice(0, 1)
        clearTimeout(listenerHeart)
        listenerHeart = null
        storeHeart = heart
        setState({ ...state })
    }

    const handlerCheckChanges = () => {

        let change = false

        if (state.user) {

            if (storeHeart == null) storeHeart = state.heart
            
            if ((storeHeart != state.heart) && state.heart < 5) {

                let newStack = new Date(addMinutes(new Date(), 5))
                if (state.stackHeart?.length > 0) newStack = new Date(addMinutes(new Date(state.stackHeart[state.stackHeart?.length - 1]), 5))
                state.stackHeart.push(newStack)
                change = true
            }

            storeHeart = state.heart
    
            if (state.stackHeart?.length > 0) {
                if (state.heart == 5) {
                    console.log("change 2")
                    state.stackHeart = []
                    change = true
                } else {

                    state.stackHeart?.forEach((item, i) => {
                        console.log(`${format(new Date(), "dd/mm/yyyy kk:mm")} after ${format(new Date(item), "dd/mm/yyyy kk:mm")}`)
                        console.log(isAfter(new Date(), new Date(item)))
                        if (isAfter(new Date(), new Date(item))) {
                            state.heart = Math.min(5, state.heart + 1)
                            change = true
                            state.stackHeart?.splice(i, 1)
                        }
                    })

                    if (!listenerHeart) {
                        console.log(`set listener ${differenceInMilliseconds(new Date(state.stackHeart[0]), new Date()) / 1000} seconds ...`)
                        listenerHeart && clearTimeout(listenerHeart)
                        listenerHeart = null
                        listenerHeart = setTimeout(handlerListenHeart, differenceInMilliseconds(new Date(state.stackHeart[0]), new Date()));
                    }
                }
            }

            if (listenerHeart && state.stackHeart?.length == 0) {   
                clearTimeout(listenerHeart)
                listenerHeart = null
            }
            
            if (change) setState({ ...state })
            console.log(state)
        }
    }

    // Effects

    useEffect(() => {

        AsyncStorage.getItem("USER").then((value) => {
            if (value) setState({ ...state, ...JSON.parse(value) })
            else setState({...state, music: true})
        }).catch((err) => console.log("[AsyncStorage]: ", err));
    }, [])
    
    useEffect(() => {

        state.user && AsyncStorage.setItem("USER", JSON.stringify(state))
        handlerCheckChanges()

    }, [state])

    // Renders

    return <GlobalContext.Provider value={[state, setState]}>{children}</GlobalContext.Provider>
}