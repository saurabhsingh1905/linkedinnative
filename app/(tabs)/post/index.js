import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
// import { firebase } from "../../../firebase";
import axios from "axios";
import { useRouter } from "expo-router";

const index = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      // console.log("token hu mai ",token)

      const decodedToken = jwt_decode(token);

      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);
  // console.log("usetId hu mai post index se User",userId)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createPost = async () => {
    try {
      // const uploadedUrl = await uploadFile();
      const uploadedUrl = "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*";

      const postData = {
        description: description,
        imageUrl: uploadedUrl,
        userId: userId,
      };

      const response = await axios.post(
        "http://192.168.52.136:8001/create",
        postData
      );

      console.log("post created successfully from post| index.js", response.data);
      
      if (response.status === 201) {
        router.push("/(tabs)/home");
      }
    } catch (error) {
      console.log("error creating post", error);
    }
  };

  // const uploadFile = async () => {
  //   try {
  //     // Ensure that 'image' contains a valid file URI
  //     console.log("Image URI:", image);

  //     const { uri } = await FileSystem.getInfoAsync(image);

  //     if (!uri) {
  //       throw new Error("Invalid file URI");
  //     }

  //     const blob = await new Promise((resolve, reject) => {
  //       const xhr = new XMLHttpRequest();
  //       xhr.onload = () => {
  //         resolve(xhr.response);
  //       };
  //       xhr.onerror = (e) => {
  //         reject(new TypeError("Network request failed"));
  //       };
  //       xhr.responseType = "blob";
  //       xhr.open("GET", uri, true);
  //       xhr.send(null);
  //     });

  //     const filename = image.substring(image.lastIndexOf("/") + 1);

  //     const ref = firebase.storage().ref().child(filename);
  //     await ref.put(blob);

  //     const downloadURL = await ref.getDownloadURL();
  //     // setUrl(downloadURL);
  //     return downloadURL;
  //     // Alert.alert("Photo uploaded");
  //   } catch (error) {
  //     console.log("Error:", error);
  //     // Handle the error or display a user-friendly message
  //   }
  // };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginVertical: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Entypo name="circle-with-cross" size={24} color="black" />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbbBpZE_un_1yVvwYzzsCuIKiagHukZY9KrB8HeS-O&s",
              }}
            />
            <Text style={{ fontWeight: "500" }}>Anyone</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginRight: 8,
          }}
        >
          <Entypo name="back-in-time" size={24} color="black" />
          <Pressable
            onPress={createPost}
            style={{
              padding: 10,
              backgroundColor: "#0072B1",
              borderRadius: 20,
              width: 80,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Post
            </Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="What do you want to talk about today !"
        placeholderTextColor={"black"}
        style={{
          marginHorizontal: 10,
          fontSize: 15,
          fontWeight: "500",
          marginTop: 10,
          borderWidth: 0.8,
          borderColor: "gray",
          padding: 6,
        }}
        multiline={true}
        numberOfLines={10}
        textAlignVertical={"top"}
      />

      <Pressable
        style={{
          flexDirection: "coloumn",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        <Pressable
          onPress={pickImage}
          style={{
            width: 40,
            height: 40,
            marginTop: 15,
            backgroundColor: "#E0E0E0",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="perm-media" size={24} color="black" />
        </Pressable>
        <Text>Media</Text>
      </Pressable>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
