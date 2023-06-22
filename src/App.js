import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RootNavigator } from './navigations'
import { Styles } from './assets'
import { ModalGameResult, ModalLoading, Player } from './components'
import { Store } from './types'

const App = () => {

	// States & variables

	// Handlers

	// Listeners

	// Effects

	// Renders

	return (
		<SafeAreaProvider style={Styles.container}>
			<Store>
				<Player />
				<RootNavigator />
				<ModalLoading />
				<ModalGameResult />
			</Store>
		</SafeAreaProvider>
	)
}

export default App