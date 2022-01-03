import React from 'react'
import { Text, TextInput, StyleSheet } from 'react-native'

const CustomInput = (props) => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;
  const hasError = errors[name] && touched[name];
  return (
    <>
      <TextInput
        style={[
          styles.textInput,
          hasError && styles.errorInput
        ]}
        value={value}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name)
          onBlur(name)
        }}
        {...inputProps}
      />
      {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
    </>
  )
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: '90%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 8
  },
  errorInput: {
    borderColor: "#cc4444",
    borderWidth: 3
  },
  errorText: {
    color: "#cc4444",
    backgroundColor: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  }
})

export default CustomInput