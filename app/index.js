// // singhsaurabh1905
// // gfXz1k0juLsMV3Vh

import { StyleSheet, Text, View } from 'react-native'
import {Redirect} from 'expo-router'

const index = () => {
  return (
  <Redirect href="/[authenticate]/login" />
  )
}

export default index

const styles = StyleSheet.create({})

