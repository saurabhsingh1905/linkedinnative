import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwt_decode from 'jwt-decode'
// import * as jwt_decode from 'jwt-decode';
import axios from 'axios'

const index = () => {
  const [userId,setUserId] = useState("")
  const [user,setUser] = useState()

  useEffect(()=>{
const fetchUser = async ()=> {
  const token = await AsyncStorage.getItem("authToken")
  console.log("token hu mai ",token) 
  
   const decodedToken = jwt_decode(token)
  //  const decodedToken = jwt_decode({token})
  console.log("shivi")
  const userId = decodedToken.userId;
  // setUserId(userId)
}
fetchUser()
},[])
console.log("usetId hu mai network setUser",userId)

useEffect(()=>{
if(userId){
  fetchUserProfile()
}
},[userId])

const fetchUserProfile =async()=>{
  try {
    const response = await axios.get(`http://192.168.230.136/profile/${userId}`)
    const userData = response.data.user
    setUser(userData)
  } catch (error) {
    console.log("Error fetching user profile",error)
  }
}
// console.log(user)

  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})