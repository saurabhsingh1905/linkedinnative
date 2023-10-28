import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";

const UserProfile = ({ item, userId }) => {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 9,
        marginHorizontal: 16,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        marginVertical: 10,
        justifyContent: "center",
        height: Dimensions.get("window").height / 3.5,
        width: (Dimensions.get("window").width - 80) / 2,
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            resizeMode: "cover",
          }}
          source={{ uri: item?.profileImage }}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600" }}>
          {item?.name}
        </Text>
        <Text style={{ textAlign: "center", marginLeft: 1, marginTop: 2 }}>
          Engineer Graduate | Linkedin member
        </Text>
      </View>

      <Pressable
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          borderColor: "#0072B1",
          borderWidth: 1,
          borderRadius: 25,
          paddingHorizontal: 15,
          marginTop: 7,
          paddingVertical: 4,
        }}
      >
        <Text style={{fontWeight:"600",color:"#0072B1"}}>Connect</Text>
      </Pressable>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
