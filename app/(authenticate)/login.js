import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(()=> {
const checkLoginStatus = async ()=>{
  try {
    const token = await AsyncStorage.getItem("authToken")
    if(token){
      router.replace("/(tabs)/home")
    }
  } catch (error) {
    console.log("Error in useEffect",error)
  }
}
checkLoginStatus()
   },[])

  const handleLogin =()=> {
    const user ={
      email:email,
      password:password
    }

    axios.post("http://192.168.165.136:8001/login",user).then((response)=>{
      // console.log(response);

      const token = response.data.token
      // console.log("login se token hu mai",token)
      AsyncStorage.setItem("authToken",token)
      router.replace("/(tabs)/home")


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
            Log in to your account
          </Text>
        </View>

        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
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

          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
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
                placeholder="Enter your Password"
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 18 : 18,
                }}
                secureTextEntry={true}
              />
            </View>
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

          <View style={{ marginTop: 70 }} />

          <Pressable
            style={{
              width: 200,
              backgroundColor: "#007FFF",
              marginLeft: "auto",
              borderRadius: 6,
              marginRight: "auto",
              padding: 15,
            }}
            onPress={handleLogin}
           
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Login
            </Text>
          </Pressable>

          <Pressable
         onPress={()=> router.replace("/register")}
      
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Signup 
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
