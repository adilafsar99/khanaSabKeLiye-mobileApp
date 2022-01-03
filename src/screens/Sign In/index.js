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
import {auth, db, signInWithEmailAndPassword, doc, getDoc} from '../../config/Firebase';

const SignIn = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const signInValidationSchema = yup.object().shape({
    email: yup.
      string().
      email("Please enter a valid email address!").
      required("Email address is required!"),
    password: yup.
      string().
      min(8, ({min}) => `Password must be atleast ${min} characters!`).
      max(14, ({max}) => `Password can be atmost ${max} characters`).
      required("Password is required!")
  })
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT)
  }
  const signIn = (values) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
    .then( async (userCredential) => {
      const docRef = doc(db, "branchAdmins", `${userCredential.user.uid}`);
      const docSnap = await getDoc(docRef);
      setIsLoading(false);
      showToast("Sign in successful!");
      if (docSnap.exists()) {
        navigation.navigate("VerificationOptions");
      }
      else {
        navigation.navigate("Tabs");
      }
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error.message);
      if (error.message.indexOf("user-not-found")) {
        showToast("This email is not registered!");
      }
      else if (error.message.indexOf("wrong-password")) {
        showToast("Your password is incorrect!");
      }
    })
  }
  return(
    <SafeAreaView>
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Sign In
        </Text>
      </View>
      <View style={styles.appLogoView}>
        <Image style={styles.appLogo} source={logo} />
      </View>
      <View style={styles.formCard}>
        <Formik
      validationSchema={signInValidationSchema}
      initialValues={{ email: "", password: "" }}
      onSubmit={(values) => signIn(values)}
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
        <View style={{marginBottom: 10}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("ResetPassword")}>
            <Text style={{color: "#fff"}}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={handleSubmit}>
          {!isLoading ? <Text style={styles.buttonText}>Sign In</Text> : <ActivityIndicator color="#0000ff" />}
        </TouchableOpacity>
        </>
      )}
        </Formik>
      </View>
      <View style={styles.link}>
        <Text style={{color: "#fff"}}>
          Don't have an account? <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("SignUp")}><Text style={styles.linkText}>Sign Up!</Text></TouchableOpacity>
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

export default SignIn;