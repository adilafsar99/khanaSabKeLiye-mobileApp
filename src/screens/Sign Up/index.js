import React, {
  useState
} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet
} from 'react-native';
import CustomInput from '../../components/Custom Input';
import {
  Formik,
  Field
} from 'formik';
import * as yup from 'yup';
import logo from '../../assets/logo/khanaSabKeLiye.png';
import {auth, db, createUserWithEmailAndPassword, doc, setDoc} from '../../config/Firebase';

const SignUp = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const signUpValidationSchema = yup.object().shape({
    email: yup.
      string().
      email("Please enter a valid email address!").
      required("Email address is required!"),
    password: yup.
      string().
      min(8, ({min}) => `Password must be atleast ${min} characters!`).
      max(14, ({max}) => `Password can be atmost ${max} characters!`).
      required("Password is required!"),
    confirmPassword: yup.
      string().
      oneOf([yup.ref("password")], "Passwords do not match!").
      required("Confirm your password!")
  })
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
  const signUp = (values) => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
    .then((userCredential) => {
      setIsLoading(false);
      showToast("Sign up successful!");
      navigation.navigate("Tabs");
    })
    .catch((error) => {
      setIsLoading(false)
      if (error.message.indexOf("auth/email-already-in-use")) {
        showToast("This email is already registered!");
      }
    })
  }
  return(
    <SafeAreaView>
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Sign Up
        </Text>
      </View>
      <View style={styles.appLogoView}>
        <Image style={styles.appLogo} source={logo} />
      </View>
      <View style={styles.formCard}>
        <Formik
      validationSchema={signUpValidationSchema}
      initialValues={{email: "", password: "", confirmPassword: "" }}
      onSubmit={(values) => signUp(values)}
      >
          {({handleSubmit}) => (
        <>
        <Field 
        component={CustomInput}
        name="email"
        placeholder="Email Address"
        keyboardType="email-address"
        />
        <Field 
        component={CustomInput}
        name="password"
        placeholder="Password"
        secureTextEntry
        />
        <Field 
        component={CustomInput}
        name="confirmPassword"
        placeholder="Confirm Password"
        secureTextEntry
        />
        <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={handleSubmit}>
        {!isLoading ?
          <Text style={styles.buttonText}>Sign Up</Text> : <ActivityIndicator color="#0000ff" />}
        </TouchableOpacity>
        </>
      )}
        </Formik>
      </View>
      <View style={styles.link}>
        <Text style={{color: "#fff"}}>
          Already have an account? <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("SignIn")}><Text style={styles.linkText}>Sign In!</Text></TouchableOpacity>
        </Text>
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
  link: {
    width: "65%",
    alignSelf: "center",
    alignItems: "center",
    paddingBottom: 5,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "#6a96ff",
    elevation: 10
  },
  linkText: {
    color: "#fff",
    fontWeight: "bold",
    position: "relative",
    top: 4
  }
})

export default SignUp;