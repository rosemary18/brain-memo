import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { DetailHeader } from '../../components';
import { Dashboard, Setting } from '../../modules';
import { transitionConfig } from '../../utils';

const Stack = createStackNavigator();

const DashboardNavigator = () => {
        
    return (
        <Stack.Navigator>
            
            <Stack.Screen
                name="DASHBOARD_SCREEN"
                component={Dashboard}
                options={{
                    headerShown: false,
                    ...transitionConfig
                }} /> 
            
            <Stack.Screen
                name="SETTING_SCREEN"
                component={Setting}
                options={{
                    header: (props) => <DetailHeader title="Pengaturan" heart={false} {...props} />,
                    ...transitionConfig
                }} /> 

        </Stack.Navigator>
    )
}

export default DashboardNavigator