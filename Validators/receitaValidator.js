import * as Yup from 'yup';

const receitaValidator = Yup.object().shape({
    nome: Yup.string()
        .min(5, 'Valor muito curto')
        .max(10, 'Valor muito grande')
        .required('Campo obrigatório'),
    
    valor: Yup.string()
        .required('Campo obrigatório'),
    
    
})

export default receitaValidator