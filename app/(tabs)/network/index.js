import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import UserProfile from "../../../components/UserProfile";
import ConnectionRequest from "../../../components/ConnectionRequest";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  //below state for holding connections
  const [users, setUsers] = useState([]);
  //below state is for holding connection request
  const [connectionRequests, setConnectionRequests] = useState([]);

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
  // console.log("usetId hu mai network se User",userId)

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  //fetching the details of myProfile

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://192.168.59.136:8001/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("Error fetching user profile", error);
    }
  };
  // console.log(user)

  //UseEffect to fetch all of the connections
  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  const fetchUsers = async () => {
    axios
      .get(`http://192.168.59.136:8001/users/${userId}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log("error while fetching connections", error);
      });
  };
  //  console.log("logs of connection ", users);

  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
    }
  }, [userId]);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.59.136:8001/connection-request/${userId}`
      );
      if (response.status === 200) {
        const connectionRequestData = response.data?.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          profileImage: friendRequest.image,
        }));
        setConnectionRequests(connectionRequestData);
      }
    } catch (error) {
      console.log("Error in getting all the friends", error);
    }
  };
  console.log("coonection request from here", connectionRequests);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Pressable
        style={{
          marginTop: 18,
          flexDirection: "row",
          marginHorizontal: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          Manage My Network
        </Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </Pressable>

      <View
        style={{ borderColor: "#E0E0E0", borderWidth: 2, marginVertical: 10 }}
      />

      <View
        style={{
          marginTop: 6,
          flexDirection: "row",
          marginHorizontal: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Invitations (0)</Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </View>
      <View
        style={{ borderColor: "#E0E0E0", borderWidth: 2, marginVertical: 10 }}
      />

      <View>
        {connectionRequests?.map((item, index) => (
          <ConnectionRequest
            item={item}
            key={index}
            connectionRequests={connectionRequests}
            setConnectionRequests={setConnectionRequests}
            userId={userId}
          />
        ))}
      </View>

      <View style={{ marginHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Grow your network faster</Text>
          <Entypo name="cross" size={24} color="black" />
        </View>

        <Text>
          Find and connect to the right people, Plus see who viewed your profile
        </Text>

        <View
          style={{
            backgroundColor: "#FFC72C",
            width: 140,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 25,
            marginTop: 8,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "600" }}
          >
            Try Premium
          </Text>
        </View>
      </View>

      <FlatList
        data={users}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item, key }) => (
          <UserProfile userId={userId} item={item} key={index} />
        )}
      />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
