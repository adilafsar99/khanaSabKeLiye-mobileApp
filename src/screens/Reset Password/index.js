import React, {useState} from 'react';
import {View, SafeAreaView, Text, Image, TouchableOpacity, ActivityIndicator, ToastAndroid, StyleSheet} from 'react-native';
import CustomInput from '../../components/Custom Input';
import {
  Formik,
  Field
} from 'formik';
import * as yup from 'yup';
import logo from '../../assets/logo/khanaSabKeLiye.png';
import {auth, sendPasswordResetEmail} from '../../config/Firebase';

const ResetPassword = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const emailValidationSchema = yup.object().shape({
    email: yup.
      string().
      email("Please enter a valid email address!").
      required("Email address is required!"),
  })
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
  const sendEmail = (values) => {
    setIsLoading(true);
    sendPasswordResetEmail(auth, values.email)
    .then(() => {
      setIsLoading(false);
      showToast("An email has been sent to your email address!");
      navigation.navigate("SignIn");
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error.message)
    })
  }
  return(
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            Reset Password
          </Text>
        </View>
        <View style={styles.appLogoView}>
          <Image style={styles.appLogo} source={logo} />
        </View>
        <View style={styles.formCard}>
          <Formik
      validationSchema={emailValidationSchema}
      initialValues={{email: ""}}
      onSubmit={(values) => sendEmail(values)}
      >
          {({handleSubmit}) => (
        <>
        <View>
          <Text style={styles.subTitle}>
            An email with a link to reset your password will be sent to your email address.
          </Text>
        </View>
        <Field 
        component={CustomInput}
        name="email"
        placeholder="Email Address"
        />
        <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={handleSubmit}>
        {!isLoading ?
          <Text style={styles.buttonText}>Send Email</Text> : <ActivityIndicator color="#0000ff" />}
        </TouchableOpacity>
        </>
      )}
        </Formik>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#6da769"
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    color: "#fff"
  },
  subTitle: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 5
  },
  appLogoView: {
    width: "50%",
    alignSelf: "center",
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#6a96ff",
    elevation: 10
  },
  appLogo: {
    width: 200,
    height: 100,
    alignSelf: "center"
  },
  formCard: {
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#6a96ff",
    elevation: 10
  },
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
  errorMessage: {
    color: "#cc4444",
    backgroundColor: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  button: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#6da769",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff"
  },
});

export default ResetPassword;