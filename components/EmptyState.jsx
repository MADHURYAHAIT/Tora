import { View, Text,Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({title,subtitle,buttontxt}) => {
  return (
    <View className="justify-centre items-center px-4">
        <Image
            source={images.empty}
            className="w-[470px] h-[305px]" 
            resizeMode='contain'
            />
        <Text className="font-pmedium text-lg text-gray-400">
            {subtitle}
        </Text>
        <Text className="font-psemibold  text-3xl text-gray-100 mt-2">
            {title}
        </Text>

        <CustomButton 
          title={buttontxt}
          handlePress={() => router.push(buttontxt === "Create a Video"? '/create' : '/home')}
          containerStyles="w-[98%] my-12"
        />
    </View>
  )
}

export default EmptyState