import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, Image, Platform, View } from "react-native";

export default function Step1CaptureImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus.status !== "granted" || mediaStatus.status !== "granted") {
        alert("Camera and Media Library permissions are required!");
      }
    }
  };

  const pickImage = async () => {
    await requestPermissions();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    await requestPermissions();
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 512, height: 512 } }], // resize to 512x512, adjust as needed
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    setImageUri(manipResult.uri);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 250, height: 250, marginBottom: 20 }}
          resizeMode="contain"
        />
      )}
      <Button title="Take Photo" onPress={takePhoto} />
      <Button title="Choose from Gallery" onPress={pickImage} />
    </View>
  );
}
