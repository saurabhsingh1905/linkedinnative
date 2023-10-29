import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';
import axios from "axios";

const register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const router = useRouter();

  const handleRegister = ()=>{
    const user ={
      name:name,
      email:email,
      password:password,
      profileImage:image
    }
    axios.post("http://192.168.165.136:8001/register",user).then((response)=>{
      // console.log(response)
      Alert.alert("Registration successful","You have ben registerd successfully")
      setName("")
      setPassword("")
      setImage("")
      setEmail("")
    }).catch((error)=>{
      Alert.alert("Registration failed","An error occurred while registring")
      console.log("Registration failed",error)
    })
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Register your account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
         
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 15,
              }}
            >
              <Ionicons
                name="person"
                size={24}
                style={{ marginLeft: 8 }}
                color="gray"
              />
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Enter your Name"
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: name ? 18 : 18,
                }}
              />
            </View>
          

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 15,
            }}
          >
            <MaterialCommunityIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your Email"
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 18 : 18,
              }}
            />
          </View>

          <View >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 15,
              }}
            >
              <AntDesign
                name="lock1"
                size={24}
                style={{ marginLeft: 8 }}
                color="gray"
              />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Enter your Password"
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 18 : 18,
                }}
              />
            </View>
          </View>

       
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 15,
              }}
            >
            
              <Entypo name="image" size={24}    style={{ marginLeft: 8 }}
                color="gray" />
              <TextInput
                value={image}
                onChangeText={(text) => setImage(text)}
               
                placeholder="Select your Image"
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: image ? 18 : 18,
                }}
              />
            </View>
     

          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Keep me Loggedin</Text>
            <Text style={{ color: "#007FFF", fontWeight: 500 }}>
              Forgot password
            </Text>
          </View>

          <View style={{ marginTop: 60 }} />

          <Pressable
            style={{
              width: 200,
              backgroundColor: "#007FFF",
              marginLeft: "auto",
              borderRadius: 6,
              marginRight: "auto",
              padding: 15,
            }}
            onPress={handleRegister}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Register
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            // onPress={()=> router.replace("/register")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
           Already have an account? Signin
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({});
