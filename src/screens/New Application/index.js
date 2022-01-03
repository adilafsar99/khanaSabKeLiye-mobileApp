import React, {
  useState,
  useEffect
} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
  Alert,
  StyleSheet
} from 'react-native';
import * as Location from 'expo-location';
import MapView, {Marker} from 'react-native-maps';
import {getDistance} from 'geolib';
import CustomInput from '../../components/Custom Input';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhotoPicker from '../../components/Image Picker';
import {
  Formik,
  Field
} from 'formik';
import * as yup from 'yup';
import logo from '../../assets/logo/khanaSabKeLiye.png';
import {auth, db, storage, onAuthStateChanged, doc, ref, getDoc, setDoc, uploadBytes, getDownloadURL} from '../../config/Firebase';

const MapButton = ({setShowMap}) => {
  return(
   <View style={[styles.container, {justifyContent: "center", alignItems: "center"}]}>
     <View style={{backgroundColor: "#6a96ff", width: "50%", padding: 10, borderRadius: 10, elevation: 10}}>
        <Image style={styles.appLogo} source={logo} />
     <TouchableOpacity activeOpacity={0.7} style={styles.mapButton} onPress={() => setShowMap(true)}>
       <Text style={styles.buttonText}>
       Create Application
       </Text>
     </TouchableOpacity> 
     </View>
   </View>
  )
}

const BranchLocator = ({setShowMap, setNearestBranch, setShowForm}) => {
  const [location, setLocation] = useState(null);
  const foodBanks = [{
    "branch_name": "Aliabad",
    "latitude": 24.9200172,
    "longitude": 67.0612345
  },
  {
    "branch_name": "Numaish Chowrangi",
    "latitude": 24.8732834,
    "longitude": 67.0337457
  },
  {
    "branch_name": "Saylani House Phase 2",
    "latitude": 24.8278999,
    "longitude": 67.0688257
  },
  {
    "branch_name": "Touheed Commercial",
    "latitude": 24.8073692,
    "longitude": 67.0357446
  },
  {
    "branch_name": "Sehar Commercial",
    "latitude": 24.8138924,
    "longitude": 67.0677652
  },
  {
    "branch_name": "Jinnah Avenue",
    "latitude": 24.8949528,
    "longitude": 67.1767206
  },
  {
    "branch_name": "Johar Chowrangi",
    "latitude": 24.9132328,
    "longitude": 67.1246195
  },
  {
    "branch_name": "Johar Chowrangi 2",
    "latitude": 24.9100704,
    "longitude": 67.1208811
  },
  {
    "branch_name": "Hill Park",
    "latitude": 24.8673515,
    "longitude": 67.0724497
  }];
  
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
  
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        showToast("Location permission is required!");
        setShowMap(false);
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    let leastDistance = getDistance(location.coords, foodBanks[0]);
    let nearestBranch = foodBanks[0].branch_name;
    foodBanks.forEach((foodBank, index) => {
      let distance = getDistance(location.coords, foodBank);
      if (distance < leastDistance) {
        leastDistance = distance;
        nearestBranch = foodBanks[index].branch_name;
      }
    })
    setTimeout(() => {
      showToast("Nearest Food Bank Selected!");
      setNearestBranch(nearestBranch);
      setShowMap(false);
      setShowForm(true);
    }, 2000)
  }
  
  useEffect(() => {
    getLocation();
  }, []);
  
  return(
    <View>
      <MapView
      region={{
        latitude: location?.coords.latitude ,
        longitude: location?.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      style={styles.map}
      >
        {location &&
          <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }}
          pinColor="#6a96ff"
          />}
        {foodBanks.map((foodBank, index) => (
          <Marker
          key={index}
          coordinate={{
            longitude: foodBank.longitude,
            latitude: foodBank.latitude,
          }}
          pinColor="#6da769"
          />
        ))}
      </MapView>
    </View>
  )
}

const Application = ({navigation, setShowForm, nearestBranch}) => {
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Daily (1 time)', value: 'daily (1)'},
    {label: 'Daily (2 times)', value: 'daily (2)'},
    {label: 'Daily (3 times)', value: 'daily (3)'},
    {label: 'Monthly', value: 'monthly'}
  ]);
  
  const showDatepicker = () => {
    setShow(true);
  };
  
  const applicationValidationSchema = yup.object().shape({
    name: yup.
      string().
      matches(/^[a-zA-Z ]+$/, "Only use English alphabets!").
      min(5, ({min}) => "Enter your full name!").
      max(30, ({max}) => `Your name can contain at most ${max} letters!`).
      required("Your name is required!"),
    fatherName: yup.
      string().
      matches(/^[a-zA-Z ]+$/, "Only use English alphabets!").
      min(5, ({min}) => "Enter your father's full name!").
      max(30, ({max}) => `The name can contain at most ${max} letters!`).
      required("Your father's name is required!"),
    mobile: yup.
      string().
      matches('^[0-9]{4}-[0-9]{7}$', "Mobile number format is 03xx-xxxxxxx!").
      required("Your mobile number is required!"),
    cnic: yup.
      string().
      matches('^[0-9]{5}-[0-9]{7}-[0-9]{1}$', "CNIC format is xxxxx-xxxxxxx-x!").
      required("Your CNIC number is required!"),
    familyMembers: yup.
      number().
      integer("Only use digits.").
      lessThan(20).
      required("Number of your family members is required!"),
    income: yup.
      number().
      integer("Only use digits").
      lessThan(50000).
      required("Your monthly income is required!"),
    food: yup.
      string().
      required("Your food requirement is required!"),
    dateOfBirth: yup.
      string().
      nullable().
      required("Your date of birth is required!"),
    photo: yup.
      string().
      nullable().
      required("Your photo is required!"),
    cnicFront: yup.
      string().
      nullable().
      required("Your CNIC frontside photo is required!"),
    cnicBack: yup.
      string().
      nullable().
      required("Your CNIC backside photo is required!")
  })
  
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
  
  const uploadImage = (file) => {
    console.log("URI", file)
    const fileName = file.slice(file.lastIndexOf("/") + 1);
    console.log("Image Name", fileName)
    const storageRef = ref(storage, `applications/${uid}/${fileName}`);
    console.log("Image Storage Path", storageRef.fullPath)
    const metadata = {
      contentType: `image/${file.slice(file.lastIndexOf("." + 1))}`
    };
    const uploadTask = uploadBytes(storageRef, file, metadata);
    uploadTask.on('state_changed',
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        return downloadURL;
      });
    },
    (error) => {
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        // ...
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    })
  }
  
  const submit = async (values) => {
    setIsLoading(true);
    //values.photo = await uploadImage(values.photo);
    //values.cnicFront = await  uploadImage(values.cnicFront);
    //values.cnicBack = await uploadImage(values.cnicBack);
    const docRef = doc(db, "applications", `${uid}`);
    const data = {
        ...values,
        serial: uid,
        foodBank: nearestBranch,
        status: "pending"
      };
    setDoc(docRef, data)
    .then(() => {
        setIsLoading(false);
        showToast("Submission successful!");
        setShowForm(false);
        navigation.navigate("Home");
    })
    .catch((error) => {
        setIsLoading(false)
        console.log("right_here", error.message)
    })
  }
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUid(user.uid);
    })
  }, []);
  
  return(
    <SafeAreaView>
    <View style={styles.container}>
    <ScrollView>
      <View style={styles.appLogoView}>
        <Image style={styles.appLogo} source={logo} />
        <Text style={styles.foodBank}>
          {nearestBranch}
        </Text>
      </View>
      <View style={styles.formCard}>
        <Formik
      validationSchema={applicationValidationSchema}
      initialValues={{name: "", fatherName: "", mobile: "", cnic: "", familyMembers: "", income: "", food: "", dateOfBirth: null, photo: null, cnicFront: null, cnicBack: null}}
      onSubmit={(values) => submit(values)}
      >
          {({setFieldValue, setFieldTouched, errors, touched, values, handleSubmit}) => (
        <>
        <Field 
        component={CustomInput}
        name="name"
        placeholder="Name"
        />
        <Field 
        component={CustomInput}
        name="fatherName"
        placeholder="Father Name"
        />
        <Field 
        component={CustomInput}
        name="mobile"
        placeholder="Mobile"
        keyboardType="numeric"
        />
        <Field 
        component={CustomInput}
        name="cnic"
        placeholder="CNIC"
        keyboardType="numeric"
        />
        <Field 
        component={CustomInput}
        name="familyMembers"
        placeholder="Family Members"
        keyboardType="numeric"
        />
        <Field 
        component={CustomInput}
        name="income"
        placeholder="Monthly Income"
        keyboardType="numeric"
        />
      <DropDownPicker
        style={[styles.dropDown, errors.food && styles.errorInput]}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={(value) => { 
          setFieldValue("food", value);
          setFieldTouched("food", true);
        }}
        />
        {(errors.food && touched.food) && <Text style={styles.errorText}>{errors.food}</Text>}
      <TouchableOpacity style={styles.picker} activeOpacity={0.7} onPress={() => showDatepicker()}>
        <Text style={styles.pickerText}>
          {values.dateOfBirth || "Date of Birth"}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          display="default"
          onChange={(event, value) => {
          if (Platform.OS !== 'ios') {
            setShow(false);
          }
          const date = value.toString().slice(4, 15);
          setFieldValue("dateOfBirth", date);
          setFieldTouched("dateOfBirth", true);
          }}
        />
      )}
      {(errors.dateOfBirth && touched.dateOfBirth) && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
      <PhotoPicker text="Your Photo" photo={values.photo} fieldName="photo" setFieldValue={setFieldValue} setFieldTouched={setFieldTouched}/>
      {(errors.photo && touched.photo) && <Text style={styles.errorText}>{errors.photo}</Text>}
      <PhotoPicker text="CNIC Frontside" photo={values.cnicFront} fieldName="cnicFront" setFieldValue={setFieldValue} setFieldTouched={setFieldTouched}/>
      {(errors.cnicFront && touched.cnicFront) && <Text style={styles.errorText}>{errors.cnicFront}</Text>}
      <PhotoPicker text="CNIC Backside" photo={values.cnicBack} fieldName="cnicBack" setFieldValue={setFieldValue} setFieldTouched={setFieldTouched}/>
      {(errors.cnicBack && touched.cnicBack) && <Text style={styles.errorText}>{errors.cnicBack}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {!isLoading ?
          <Text style={styles.buttonText}>Submit</Text> : <ActivityIndicator color="#0000ff" />}
        </TouchableOpacity>
        </>
      )}
        </Formik>
      </View>
    </ScrollView>
    </View>
   </SafeAreaView>
  )
}

const NewApplication = ({navigation}) => {
  const [showMap, setShowMap] = useState(false);
  const [nearestBranch, setNearestBranch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  return(
    showMap ? <BranchLocator setShowMap={setShowMap} setNearestBranch={setNearestBranch} setShowForm={setShowForm} />
    : showForm ? <Application navigation={navigation} setShowForm={setShowForm} nearestBranch={nearestBranch} /> : <MapButton setShowMap={setShowMap} />
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#6da769"
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  appLogoView: {
    width: "50%",
    alignSelf: "center",
    paddingVertical: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#6a96ff",
    marginTop: 10,
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
    marginBottom: 10,
    elevation: 10
  },
  foodBank: {
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    marginTop: 8
  },
  dropDown: {
    width: "90%",
    height: 40,
    borderWidth: 0,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center"
  },
  picker: {
    width: 145,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#6da769",
    justifyContent: "center",
    paddingHorizontal: 2,
    marginBottom: 10,
    elevation: 3
  },
  pickerText: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center"
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
  },
  mapButton: {
    width: 130,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#6da769",
    alignSelf: "center",
    marginTop: 5,
    justifyContent: "center",
    elevation: 3
  },
  button: {
    width: 80,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#6da769",
    justifyContent: "center",
    elevation: 3
  },
  buttonText: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center"
  },
})

export default NewApplication;