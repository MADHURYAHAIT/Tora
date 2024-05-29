import { TouchableOpacity,Text } from 'react-native'
import React from 'react'

const CustomButton = ({
    title,handlePress,containerStyles, textStyle, isLoading
}) => {
  return (
    <TouchableOpacity className={`bg-secondary rounded-xl min-h-[62px] justify-center w-[290px] items-center`}>
      <Text className="text-primary front-p text-lg b-6">Custom Button</Text>
    </TouchableOpacity>
  )
}

export default CustomButton