import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AVATARS, COLORS, Styles } from '../assets'
import { ModalLoading } from '../components'
import { GlobalContext, WIDTH } from '../types'

const Landing = ({ navigation, route }) => {

	// States & variables

	const [state, setState] = useContext(GlobalContext)
	const [form, setForm] = useState({
		avatar: 2,
		name: ""
	})

	// Handlers

	const handlerSetForm = (k, v) => (_v) => {

		form[k] = v != undefined ? v : _v
		setForm({...form})
	}

	const handlerGo = async () => {

		const data = {
			...state,
			user: form,
			heart: 5,
			music: true
		}

		ModalLoading.show()

		await AsyncStorage.setItem('USER', JSON.stringify(data))
		await setState({...data})
		navigation?.navigate?.("DASHBOARD_NAVIGATOR")
	}

	// Effects

	useEffect(() => {

		ModalLoading.show(5000)

	}, [])

	// Renders

	const renderAvatar = (icon, index) => (
		<TouchableOpacity
			onPress={handlerSetForm("avatar", index)}
			activeOpacity={.7}
			style={[styles.avatars, index == form.avatar && { borderColor: COLORS.PRIMARY }]}
			key={index?.toString?.()}>
			<Image source={icon} style={{height: 48, width: 48}} resizeMode="cover" />
		</TouchableOpacity>
	)
	
	return (
		<View style={[Styles.container1, { justifyContent: "center", alignItems: "center" }]}>
			<Text style={[Styles.extraBold2, { marginBottom: 16 }]}>AVATAR</Text>
			<View style={styles.containerAvatars}>
				{AVATARS.map(renderAvatar)}
			</View>
			<TextInput
				placeholder='Nama'
				placeholderTextColor={COLORS.GRAY2}
				value={form.name}
				onChangeText={handlerSetForm('name')}
				style={styles.textInput} />
			
			<TouchableOpacity
				onPress={handlerGo}
				style={[styles.btn, { opacity: form.name?.length > 0 ? 1 : 0 }]}
				activeOpacity={.7} disabled={form.name?.length == 0}>
				<Text style={Styles.bold2White}>Go!</Text>
			</TouchableOpacity>

		</View>
	)
}

const styles = StyleSheet.create({
	containerAvatars: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 24
	},
	avatars: {
		padding: 4,
		borderRadius: 5,
		overflow: "hidden",
		marginHorizontal: 4,
		borderWidth: 1.5,
		borderColor: COLORS.TRANSPARENT
	},
	textInput: {
		minHeight: 48,
		borderRadius: 5,
		borderWidth: 1.5,
		borderColor: COLORS.PRIMARY,
		minWidth: WIDTH * .7,
		marginVertical: 6,
		paddingHorizontal: 12,
		...Styles.bold
	},
	btn: {
		borderRadius: 5,
		backgroundColor: COLORS.SECONDARY,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 16,
		minHeight: 40,
		marginVertical: 12
	}
})

export default Landing