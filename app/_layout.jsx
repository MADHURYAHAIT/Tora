import {  Text, View } from 'react-native'
import React from 'react'
import { Slot,Stack } from 'expo-router'
const Rootlayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index"/>
    </Stack>
    
  )
}

export default Rootlayout

