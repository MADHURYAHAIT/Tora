import { View, Text,Image } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'


const Pages = () => {
  return (
    <>
   
      <Stack>
      
        <Stack.Screen
          name='settings'
          options={{
            headerShown:false
          }}/>
      </Stack>
      <StatusBar backgroundColor='#161622' style='light'/>
    </>

  )
}

export default Pages