import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
const Rootlayout = () => {
  return (
    <Slot/>
    
  )
}

export default Rootlayout

const styles = StyleSheet.create({
    container: {
        display:'flex',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})