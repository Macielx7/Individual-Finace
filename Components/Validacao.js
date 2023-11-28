import React from 'react'
import { Text } from 'react-native-paper'

const Validacao = ({errors, touched}) => {
    return (
        <>
            {(errors && touched) &&
                <Text style={{ color: 'red', marginTop: 5 }}>
                    {errors}
                </Text>
            }
        </>
    )
}

export default Validacao