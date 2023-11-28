import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup'; // Importando yup para validação
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Validacao from '../../Components/Validacao';
import { mask } from 'remask';

const receitaValidator = yup.object({
  pagamento: yup.string().required('O Pagamento é obrigatório'),
  nome: yup.string().required('O valor é obrigatório'),
  valor: yup.string().required('O valor é obrigatório'),
  categoria: yup.string().required('A categoria é obrigatória'),
  data: yup.date().required('A data é obrigatória'),
});

const ReceitasForm = ({ navigation, route }) => {
  const categorias = ['Salário', 'Renda Extra', 'Investimentos', 'Aluguel', 'Outros'];
  const pagamentos = ['Dinheiro', 'Credito', 'Debito', 'Boleto', 'Pix'];

  let receita = {
    nome: '',
    valor: '',
    categoria: '',
    pagamento: '',
    data: new Date(),
  };

  const id = route.params?.id;

  if (id >= 0) {
    receita = route.params?.receita;
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date, setFieldValue) => {
    hideDatePicker();
    if (date instanceof Date && !isNaN(date)) {
      // Ajusta para o fuso horário UTC
      const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      setFieldValue('data', utcDate.toISOString().split('T')[0]);
    }
  };


  const salvar = async (values) => {
    try {
      AsyncStorage.getItem('receitas').then((resultado) => {
        const receitas = JSON.parse(resultado) || [];

        if (id >= 0) {
          receitas.splice(id, 1, values);
        } else {
          receitas.push(values);
        }

        AsyncStorage.setItem('receitas', JSON.stringify(receitas));

        navigation.goBack();
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  return (
    <ScrollView style={{ margin: 15 }}>
      <Text>Formulário de Receitas</Text>

      <Formik
        initialValues={receita}
        validationSchema={receitaValidator}
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
              label='Nome Receita'
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
            {(errors.pagamento && touched.pagamento) && (
              <Text style={{ color: 'red', marginTop: 5 }}>
                {errors.pagamento}
              </Text>
            )}

            <TextInput
              style={{ marginTop: 10 }}
              label='Valor da Receita'
              mode='outlined'
              keyboardType='decimal-pad'
              value={values.valor}
              onChangeText={(value) => { setFieldValue('valor', mask(value, 'R$ 99.999,99')) }}
            />
            <Validacao errors={errors.valor} touched={touched.valor} />

            <TextInput
              style={{ marginTop: 10 }}
              label='Data Lançamento'
              mode='outlined'
              value={values.data ? new Date(values.data).toLocaleDateString() : ''}
              onChangeText={(text) => setFieldValue('data', text)}
            />

            
            


            <Button onPress={showDatePicker}>Escolher Data</Button>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => handleConfirm(date, setFieldValue)}
              onCancel={hideDatePicker}
              date={new Date(values.data)} // Adiciona esta linha
            />

            

            

            <Button onPress={handleSubmit}>Salvar</Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default ReceitasForm;
