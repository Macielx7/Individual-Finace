import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { ScrollView, View } from 'react-native'
import { Button, Card, Dialog, FAB, IconButton, MD3DarkTheme, Portal, Text } from 'react-native-paper'

const Despesas = ({ navigation }) => {
  const [despesas, setdespesas] = useState([])
  const [idExcluir, setIdExcluir] = useState(0)

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [pagamentos, setPagamentos] = useState(Array(despesas.length).fill(false));


  useFocusEffect(
    React.useCallback(() => {
      carregarDados()
    }, [])
  );

  function carregarDados() {
    AsyncStorage.getItem('despesas').then(resultado => {
      resultado = JSON.parse(resultado) || []
      setdespesas(resultado)
    })
  }

  function confirmarExclusao(id) {
    setIdExcluir(id)
    setVisible(true)
  }

  function excluir() {
    despesas.splice(idExcluir, 1)
    AsyncStorage.setItem('despesas', JSON.stringify(despesas))
    carregarDados()
    setVisible(false)
  }

  return (
    <>

      <ScrollView style={{ padding: 15 }}>

        {despesas.map((item, i) => (
          <Card
            key={i}
            mode='outlined'
            style={{ marginBottom: 10, backgroundColor: pagamentos[i] ? 'lightgreen' : 'white' }}
          >
            <Card.Content>
              <Text variant="titleLarge">{item.nome}</Text>
              <Text variant="bodyMedium">Categoria: {item.categoria}</Text>
              <Text variant="bodyMedium">Valor: {item.valor}</Text>
              <Text variant="bodyMedium">Lançamento: {new Date(item.data).toLocaleDateString()}</Text>
              <Text variant="bodyMedium">Vencimento: {new Date(item.dataVencimento).toLocaleDateString()}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton
                icon='pencil-outline'
                onPress={() => navigation.push('despesas-form', { id: i, despesa: item })}
              />
              <IconButton
                icon='check'
                onPress={() => {
                  const novosPagamentos = [...pagamentos];
                  novosPagamentos[i] = !novosPagamentos[i];
                  setPagamentos(novosPagamentos);
                }}
              />
              <IconButton
                icon='trash-can-outline'
                onPress={() => confirmarExclusao(i)}
              />
            </Card.Actions>
            {pagamentos[i] && (
              <View style={{ padding: 10, backgroundColor: 'green' }}>
                <Text style={{ color: 'white' }}>Pago</Text>
              </View>
            )}
          </Card>
        ))}

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Text variant="bodyMedium">Deseja realmente excluir o registro?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={excluir}>Sim</Button>
              <Button onPress={hideDialog}>Não</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

      </ScrollView>

      <FAB
        icon="plus"
        size='small'
        style={{ position: 'absolute', right: 10, bottom: 10 }}
        onPress={() => navigation.push('despesas-form')}
      />

    </>
  )
}

export default Despesas