import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Validacao from '../../Components/Validacao';
import { mask } from 'remask';

const despesaValidator = yup.object({
  nome: yup.string().required('O nome é obrigatório'),
  valor: yup.string().required('O valor é obrigatório'),
  categoria: yup.string().required('A categoria é obrigatória'),
  data: yup.date().required('A data é obrigatória'),
  dataVencimento: yup.date().required('A data de vencimento é obrigatória'),
});

const DespesasForm = ({ navigation, route }) => {
  const categorias = ['Aluguel', 'Conta de Água', 'Conta de Luz', 'Combustível', 'Conta de Internet'];
  const pagamentos = ['Dinheiro', 'Crédito', 'Débito', 'Boleto', 'Pix'];

  const [dataField, setDataField] = useState('data'); // Adicione esta linha

  let despesa = {
    nome: '',
    valor: '',
    categoria: '',
    pagamento: '',
    data: new Date(),
    dataVencimento: new Date(), // Adicione esta linha
  };

  const id = route.params?.id;

  if (id >= 0) {
    despesa = route.params?.despesa;
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = (dataField) => {
    setDataField(dataField);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date, setFieldValue) => {
    hideDatePicker();
    if (date instanceof Date && !isNaN(date)) {
      const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      setFieldValue(dataField, utcDate.toISOString().split('T')[0]);
    }
  };

  const salvar = async (values) => {
    try {
      AsyncStorage.getItem('despesas').then((resultado) => {
        const despesas = JSON.parse(resultado) || [];

        if (id >= 0) {
          despesas.splice(id, 1, values);
        } else {
          despesas.push(values);
        }

        AsyncStorage.setItem('despesas', JSON.stringify(despesas));

        navigation.goBack();
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <ScrollView style={{ margin: 15 }}>
      <Text>Formulário de despesas</Text>

      <Formik
        initialValues={despesa}
        validationSchema={despesaValidator}
        onSubmit={(values) => salvar(values)}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>

            <TextInput
              style={{ marginTop: 10 }}
              label='Nome despesa'
              mode='outlined'
              value={values.nome}
              onChangeText={handleChange('nome')}
            />
            <Validacao errors={errors.nome} touched={touched.nome} />

            <Picker
              style={{ marginTop: 10, height: 50, color: 'black', backgroundColor: 'white' }}
              selectedValue={values.categoria}
              mode='outlined'
              onValueChange={(itemValue) => setFieldValue('categoria', itemValue)}
            >
              <Picker.Item label='Selecione a categoria' value='' />
              {categorias.map((categoria, index) => (
                <Picker.Item key={index} label={categoria} value={categoria} />
              ))}
            </Picker>
            <Validacao errors={errors.categoria} touched={touched.categoria} />

            <Picker
              style={{ marginTop: 10, height: 50, color: 'black', backgroundColor: 'white' }}
              selectedValue={values.pagamento}
              mode='outlined'
              onValueChange={(itemValue) => setFieldValue('pagamento', itemValue)}
            >
              <Picker.Item label='Selecione a pagamento' value='' />
              {pagamentos.map((pagamento, index) => (
                <Picker.Item key={index} label={pagamento} value={pagamento} />
              ))}
            </Picker>
            <Validacao errors={errors.pagamento} touched={touched.pagamento} />

            <TextInput
              style={{ marginTop: 10 }}
              label='Valor da despesa'
              mode='outlined'
              keyboardType='decimal-pad'
              value={values.valor}
              onChangeText={(value) => { setFieldValue('valor', mask(value, 'R$ 99.999,99')) }}
            />
            <Validacao errors={errors.valor} touched={touched.valor} />

            <TextInput
              style={{ marginTop: 10 }}
              label='Data'
              mode='outlined'
              value={values.data ? new Date(values.data).toLocaleDateString() : ''}
              onChangeText={(text) => setFieldValue('data', text)}
            />
            <Button onPress={() => showDatePicker('data')}>Data de Lançamento</Button>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => handleConfirm(date, setFieldValue)}
              onCancel={hideDatePicker}
              date={new Date(values[dataField])}
            />
            <Validacao errors={errors.data} touched={touched.data} />

            <TextInput
              style={{ marginTop: 10 }}
              label='Data de Vencimento'
              mode='outlined'
              value={values.dataVencimento ? new Date(values.dataVencimento).toLocaleDateString() : ''}
              onChangeText={(text) => setFieldValue('dataVencimento', text)}
            />
            <Button onPress={() => showDatePicker('dataVencimento')}>Data de Vencimento</Button>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => handleConfirm(date, setFieldValue)}
              onCancel={hideDatePicker}
              date={new Date(values[dataField])}
            />
            <Validacao errors={errors.dataVencimento} touched={touched.dataVencimento} />

            <Button onPress={handleSubmit}>Salvar</Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default DespesasForm;
