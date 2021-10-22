import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  FlatList,
  SafeAreaView,
  ScrollView,
} from "react-native";
// import logo from "./assets/logo.png";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import uploadToAnonymousFilesAsync from "anonymous-files";
import { SelectedImage } from "./interfaces";
import { usePrefectures } from "./hooks/usePrefectures";

interface Prefectures {
  prefCode: number;
  prefName: string;
}

export default function App() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  const { prefectures, isLoading, isError } = usePrefectures();

  console.log(prefectures);

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === "web") {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  const openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(
        `The image is available for sharing at: ${
          selectedImage?.remoteUri || ""
        }`
      );
      return;
    }

    await Sharing.shareAsync(selectedImage?.localUri || "");
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Prefectures }) => {
    return (
      <View style={styles.container}>
        <Text key={item.prefCode} style={styles.instructions}>
          {item.prefName}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Text style={styles.instructions}>Loading...</Text>
      ) : (
        <>
          <ScrollView>
            <Text style={styles.instructions}>
              To share a photo from your phone with a friend, just press the
              button below!
            </Text>
            <TouchableOpacity
              onPress={openImagePickerAsync}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Pick a photo</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: "https://i.imgur.com/TkIrScD.png" }}
              style={styles.logo}
            />
            {/* <Image source={logo} style={{ width: 305, height: 159 }} /> */}
            <StatusBar style="auto" />
          </ScrollView>
          <FlatList
            data={prefectures}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.prefCode}`}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});
