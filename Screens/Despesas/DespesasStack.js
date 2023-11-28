import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Despesas from './Despesas';
import DespesasForm from './DespesasForm';

const Stack = createNativeStackNavigator();

const DespesasStack = () => {
  return (
    <>
            <Stack.Navigator initialRouteName='despesas'>
                <Stack.Screen name="despesas" component={Despesas} options={{ title: 'Despesas' }} />
                <Stack.Screen name="despesas-form" component={DespesasForm} options={{ title: 'Cadastro de Despesas' }} />
            </Stack.Navigator>
        </>
  )
}

export default DespesasStack