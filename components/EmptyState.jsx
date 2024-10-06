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
<<<<<<< HEAD
          handlePress={() => router.push(buttontxt === "Create a Video"? '/create' : '/home')}
=======
          handlePress={() => router.push(buttontxt === "Add a Bookmark Now"? '/home' : '/create')}
>>>>>>> 3eadc8e425f36f17e467ca3cd8ef6b5dbd4089a7
          containerStyles="w-[98%] my-12"
        />
    </View>
  )
}

export default EmptyState