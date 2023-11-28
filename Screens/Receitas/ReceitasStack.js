import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Receitas from './Receitas';
import ReceitasForm from './ReceitasForm';

const Stack = createNativeStackNavigator();

const ReceitasStack = () => {
    return (
        <>
            <Stack.Navigator initialRouteName='receitas'>
                <Stack.Screen name="receitas" component={Receitas} options={{ title: 'Receitas' }} />
                <Stack.Screen name="receitas-form" component={ReceitasForm} options={{ title: 'Cadastro de Receitas' }} />
            </Stack.Navigator>
        </>
    )
}

export default ReceitasStack