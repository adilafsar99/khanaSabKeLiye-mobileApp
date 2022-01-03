import React, {
  useState,
  useEffect
} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet
} from 'react-native';
import { Camera } from 'expo-camera';
import logo from '../../assets/logo/khanaSabKeLiye.png';
import {auth, db, doc, getDoc, signOut} from '../../config/Firebase';
import Icon from 'react-native-vector-icons/AntDesign';

const QRCodeScanner = ({getApplication}) => {
  const [hasPermission, setHasPermission] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return(
    <Camera 
    style={styles.scanner}
    type={Camera.Constants.Type.back}
    onBarCodeScanned={({data}) => getApplication(data)}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.button}>
          <Text>
            Flip 
          </Text>
        </TouchableOpacity>
      </View>
    </Camera>
  )
}

const Application = ({application}) => {
  return(
    <View style={styles.application}>
      <View style={styles.cardLine}>
              <Text style={styles.cardLineText}>
                Name:&nbsp;
              </Text>
              <Text style={[styles.cardLineText, styles.cardLineData]}>
                {application.name}
              </Text>
            </View>
            <View style={styles.cardLine}>
              <Text style={styles.cardLineText}>
                Family Members:&nbsp;
              </Text>
              <Text style={[styles.cardLineText, styles.cardLineData]}>
                {application.familyMembers}
              </Text>
            </View>
            <View style={styles.cardLine}>
              <Text style={styles.cardLineText}>
                Monthly Income:&nbsp;
              </Text>
              <Text style={[styles.cardLineText, styles.cardLineData]}>
                {application.income} Rs
              </Text>
            </View>
            <View style={styles.cardLine}>
              <Text style={styles.cardLineText}>
                Food Requirement:&nbsp;
              </Text>
              <Text style={[styles.cardLineText, styles.cardLineData]}>
                {application.food}
              </Text>
            </View>
            <View style={styles.cardLine}>
              <Text style={styles.cardLineText}>
                Status:&nbsp;
              </Text>
              <Text style={[styles.cardLineText, styles.cardLineData]}>
                {application.status}
              </Text>
            </View>
            <View style={styles.cardLine}>
              <Text style={styles.foodBankHeading}>
                Food Bank Branch Name
              </Text>
            </View>
            <View style={styles.cardLine}>
              <Text style={styles.foodBankText}>
                {application.foodBank}
              </Text>
            </View>
    </View>
  )
}

const VerificationOptions = ({navigation}) => {
  const [serial, setSerial] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState(null);
  
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
  
  const getApplication = async (data) => {
    setIsLoading(true);
    if (!serial && !data) {
      setIsLoading(false);
      if (application) {
        setApplication(false);
      }
      showToast("Serial number not entered!");
      return;
    }
    const docRef = doc(db, "applications", data || serial);
    const response = await getDoc(docRef);
    if (response.exists()) {
      setApplication(response.data());
      if (showScanner) {
        setShowScanner(false);
      }
      setIsLoading(false);
    }
    else {
      showToast("No application found!");
      setIsLoading(false);
    }
  }
  
  const logOut = () => {
    signOut(auth)
    .then(() => {
      navigation.navigate("SignIn")
    })
  }
  
  return(
    <SafeAreaView>
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Verify Applications
        </Text>
      </View>
      <View style={styles.appLogoView}>
        <Image style={styles.appLogo} source={logo} />
      </View>
      <View style={styles.formCard}>
        <TextInput 
        name="serial"
        placeholder="Enter Serial Number"
        type="text"
        value={serial}
        onChangeText={(value) => setSerial(value)}
        style={styles.textInput}
        />
        <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={() => getApplication()}>
        {!isLoading ?
          <Text style={styles.buttonText}>Search</Text> : <ActivityIndicator color="#0000ff" />}
        </TouchableOpacity>
        <View style={styles.divider}></View>
        {showScanner && <QRCodeScanner getApplication={getApplication} />}
        {application && <Application application={application} />}
        <View style={styles.divider}></View>
        <View style={styles.scanView}>
          <TouchableOpacity style={[styles.scanButton]} activeOpacity={0.7} onPress={() => { setShowScanner(!showScanner);
            setApplication(false);
          }}>
            <Text style={styles.buttonText}>
              {!showScanner ? "Scan QR Code" : "Hide Scanner"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.signOutButton} activeOpacity={0.7} onPress={() => logOut()}>
         <Icon name="export" color="#fff" size={40} />
       </TouchableOpacity>
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
  button: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#6da769",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 5
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff"
  },
  divider: {
    width: "90%",
    height: 0,
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 0.5,
  },
  scanner: {
    width: "90%",
    height: 300,
    marginVertical: 10
  },
  application: {
    marginVertical: 10
  },
  cardLine: {
    flexDirection: "row",
    alignSelf: "center"
  },
  cardLineText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold"
  },
  cardLineData: {
    fontSize: 20,
    textTransform: "capitalize",
    position: "relative",
    bottom: 3
  },
  foodBankHeading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },
  foodBankText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center"
  },
  scanView: {
    marginTop: 10,
    alignSelf: "center",
    alignItems: "center",
    paddingBottom: 5,
  },
  scanButton: {
    width: 110,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#6da769",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5
  },
  signOutButton: {
    width: 60,
    height: 60,
    position: "absolute",
    right: 20,
    bottom: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6a96ff",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 30,
    elevation: 10
  },
  buttonContainer: {
    display: "none"
  }
})

export default VerificationOptions;