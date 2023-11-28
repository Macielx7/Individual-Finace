import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReceitasStack from './Screens/Receitas/ReceitasStack';
import DespesasStack from './Screens/Despesas/DespesasStack';


const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator initialRouteName='Receitas'>
            <Tab.Screen
              name="Receitas" 
              component={ReceitasStack}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="cash-multiple" size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="Despesas" 
              component={DespesasStack}
              options={{
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="hand-coin" size={26} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
}