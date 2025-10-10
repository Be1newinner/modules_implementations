import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

const FIXED_WIDTH = 512;
const FIXED_HEIGHT = 512;

export default function CapturePreprocessImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const selectImage = async () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: false },
      async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert(
            'ImagePicker Error',
            response.errorMessage || 'Unknown error',
          );
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            await resizeImage(uri);
          }
        }
      },
    );
  };

  const takePhoto = async () => {
    launchCamera(
      { mediaType: 'photo', includeBase64: false },
      async response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          Alert.alert('Camera Error', response.errorMessage || 'Unknown error');
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            await resizeImage(uri);
          }
        }
      },
    );
  };

  const resizeImage = async (uri: string) => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        FIXED_WIDTH,
        FIXED_HEIGHT,
        'JPEG',
        80,
      );
      setImageUri(resizedImage.uri);
    } catch (error) {
      Alert.alert('Resize Error', 'Failed to resize image');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo" onPress={takePhoto} />
      <Button title="Select Photo" onPress={selectImage} />
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.Image}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image: {
    width: FIXED_WIDTH / 2,
    height: FIXED_HEIGHT / 2,
    marginTop: 20,
  },
});
