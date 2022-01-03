import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoPicker({text, photo, fieldName, setFieldValue, setFieldTouched}) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setFieldValue(fieldName, result.uri);
      setFieldTouched(fieldName, true);
    }
    console.log(photo)
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity style={styles.pickerButton} activeOpacity={0.7} onPress={pickImage}>
        <Text style={styles.pickerText}>
          {text}
        </Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100 , marginBottom: 10}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
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
    alignSelf: "center"
  },
});