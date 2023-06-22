import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { DetailHeader } from '../../components';
import { GamePlayImage, GamePlayWord } from '../../modules/gameplay';
import { transitionConfig } from '../../utils';

const Stack = createStackNavigator();

const GamePlayNavigator = () => {
        
    return (
        <Stack.Navigator>
            
            <Stack.Screen
                name="PLAY_WORD_SCREEN"
                component={GamePlayWord}
                options={{
                    header: (props) => <DetailHeader {...props} />,
                    ...transitionConfig
                }} /> 
            
            <Stack.Screen
                name="PLAY_IMAGE_SCREEN"
                component={GamePlayImage}
                options={{
                    header: (props) => <DetailHeader {...props} />,
                    ...transitionConfig
                }} /> 

        </Stack.Navigator>
    )
}

export default GamePlayNavigator