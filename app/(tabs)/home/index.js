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
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

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

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  //fetching the details of myProfile

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://192.168.52.136:8001/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("Error fetching user profile", error);
    }
  };
  // console.log(user)

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const response = await axios.get("http://192.168.52.136:8001/all");
        setPosts(response.data.posts);
      } catch (error) {
        console.log("Error fetching all post im home index.js", error);
      }
    };
    fetchAllPost();
  }, []);
  // console.log("you can see all the post here from home index",posts)

  return (
    <ScrollView>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Pressable>
          <Image
            source={{ uri: user?.profileImage }}
            style={{ width: 30, height: 30, borderRadius: 15 }}
          />
        </Pressable>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 30,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ marginLeft: 10 }}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput placeholder="Search" />
        </Pressable>
        <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
      </View>

      <View>
        {posts.map((item, index) => (
          <View key={index}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Image
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                  source={{ uri: item?.user?.profileImage }}
                />

                <View style={{ flexDirection: "column", gap: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    {item?.user?.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      width: 230,
                      color: "gray",
                      fontSize: 15,
                      fontWeight: "400",
                    }}
                  >
                    Engineer Graduate | LinkedIn Member
                  </Text>
                  <Text style={{ color: "gray" }}>
                    {moment(item.createdAt).format("MMMM Do YYYY")}
                  </Text>
                </View>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Entypo name="dots-three-vertical" size={20} color="black" />

                <Feather name="x" size={20} color="black" />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
