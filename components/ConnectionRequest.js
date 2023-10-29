import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';

const ConnectionRequest = ({
  item,
  connectionRequests,
  setConnectionRequests,
  userId,
}) => {

const acceptConnection = async(requestId)=>{
try {
  const response = await fetch("http://192.168.165.136:8001/connection-request/accept",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      senderId:requestId,
      recepientId:userId
    })
  })

  if(response.ok){
    setConnectionRequests(
      connectionRequests.filter((request) => request._id !== requestId)
    );
  }
} catch (error) {
  console.log("Error from acceptConnection function",error)
}
}

const declineConnection = async(requestId)=>{
  try {
    const response = await fetch("http://192.168.165.136:8001/connection-request/decline",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        senderId:requestId,
        recepientId:userId
      })
    })
  
    if(response.ok){
      setConnectionRequests(
        connectionRequests.filter((request) => request._id !== requestId)
      );
    }
  } catch (error) {
    console.log("Error from acceptConnection function",error)
  }
  }


  return (
    <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={{ uri: item?.image }}
        />
        <Text style={{ width: 200 }}>
          {item?.name} is inviting you to connect
        </Text>

        <View style={{flexDirection:"row",alignItems:"center",gap:10}}>
          <Pressable
           onPress={()=>declineConnection(item._id)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo name="cross" size={22} color="black" />
          </Pressable>
          <Pressable
          onPress={()=>acceptConnection(item._id)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
        <Ionicons name="checkmark-outline" size={22} color="#0072B1"/>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ConnectionRequest;

const styles = StyleSheet.create({});
