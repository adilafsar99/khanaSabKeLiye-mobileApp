import React, {useState, useEffect} from 'react';
import {View, StatusBar, SafeAreaView, Text, Image, TouchableOpacity, ToastAndroid, StyleSheet} from 'react-native';
import logo from '../../assets/logo/khanaSabKeLiye.png';
import {auth, db, onAuthStateChanged, doc, onSnapshot, signOut} from '../../config/Firebase';
import Icon from 'react-native-vector-icons/AntDesign';
import QRCode from 'react-native-qrcode-svg';

const ResolvedApplication = ({application}) => {
  return(
    <>
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
                Father Name:&nbsp;
              </Text>
              <Text style={[styles.cardLineText, styles.cardLineData]}>
                {application.fatherName}
              </Text>
            </View>
            <View style={styles.cardLine}>
              <Text style={styles.cardLineText}>
                Mobile:&nbsp;
              </Text>
              <Text style={[styles.cardLineText, styles.cardLineData]}>
                {application.mobile}
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
            {application.status === "approved" && 
            <> 
            <View style={styles.divider}></View>
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
            </>}
            </>
  )
}

const ApplicationCard = ({application}) => {
    if (application.status === "pending") {
      return(
        <View style={styles.cardView}>
          <View style={styles.appLogoView}>
            <Image style={styles.appLogo} source={logo} />
          </View>
          <View style={styles.card}>
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
          </View>
        </View>
      )
    }
    else if (application.status === "approved") {
      const [showQR, setShowQR] = useState(false);
      return(
        <View style={styles.cardView}>
          <View style={styles.appLogoView}>
            <Image style={styles.appLogo} source={logo} />
          </View>
          <View style={[styles.card, {width: "85%", height: 300}]}>
            {!showQR ? <ResolvedApplication  application={application} /> :
            <>
            <View style={styles.qrCode}>
              <QRCode
               value={application.serial}
               size={200}
              />
            </View>
            <View style={styles.cardLine}>
              <Text style={styles.serialHeading}>
                S.NO:&nbsp;
              </Text>
              <Text style={styles.serial}>
                {application.serial}
              </Text>
            </View>
            </>
          }
          </View>
          <View style={styles.switchView}>
            <TouchableOpacity style={styles.switchButton} activeOpacity={0.7} onPress={() => setShowQR(!showQR)}>
              <Text style={styles.buttonText}>
                Switch
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    else if (application.status === "rejected") {
      return(
        <View style={styles.cardView}>
          <View style={styles.appLogoView}>
            <Image style={styles.appLogo} source={logo} />
          </View>
          <View style={[styles.card, {width: "85%", height: 300}]}>
            <ResolvedApplication  application={application} />
          </View>
        </View>
      )
    }
 }

const Home = ({navigation}) => {
  const [uid, setUid] = useState(null);
  const [application, setApplication] = useState(null);
  const docRef = doc(db, "applications", `${uid}`);
  const unsub = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      setApplication(doc.data());
    }
  });
  
  const logOut = () => {
    signOut(auth)
    .then(() => {
      navigation.navigate("SignIn")
    })
  }
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUid(user.uid)
    })
  }, [])
  
  return(
   <SafeAreaView>
     <View style={styles.container}>
     {application ? <ApplicationCard application={application} /> :
       <View style={styles.messageView}>
         <Text style={styles.message}>
           No application found. After you send an application, you can check its status here.
         </Text>
       </View>}
       <TouchableOpacity style={styles.signOutButton} activeOpacity={0.7} onPress={() => logOut()}>
         <Icon name="export" color="#fff" size={40} />
       </TouchableOpacity>
     </View>
     <StatusBar hidden={true} />
   </SafeAreaView> 
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#6da769",
  },
  messageView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  message: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20
  },
  cardView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  appLogoView: {
    width: "40%",
    alignSelf: "center",
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#6a96ff",
    marginTop: 10,
    elevation: 10
  },
  appLogo: {
    width: 150,
    height: 75,
    alignSelf: "center"
  },
  card: {
    width: "75%",
    height: 200,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#6a96ff",
    borderRadius: 10,
    elevation: 10,
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
  divider: {
    width: "90%",
    height: 0,
    alignSelf: "center",
    borderColor: "#fff",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5
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
  qrCode: {
    alignSelf: "center",
    marginBottom: 25
  },
  serialHeading: {
    color: "#fff",
    fontWeight: "bold"
  },
  serial: {
   color: "#fff",
   fontWeight: "bold",
   fontSize: 15,
   position: "relative",
   bottom: 2
  },
  switchView: {
    width: "30%",
    alignSelf: "center",
    backgroundColor: "#6a96ff",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    paddingTop: 5,
    paddingBottom: 10,
    elevation: 10
  },
  switchButton: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#6da769",
    alignSelf: "center",
    justifyContent: "center",
    elevation: 3
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center"
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
});

export default Home;