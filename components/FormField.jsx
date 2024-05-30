import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants';
const FormField = ({title,value,placeholder,handleChangeText,otherStyles,...props}) => {
    const[showPassword,setShowPassword]= useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-400 font-pmedium">{title} </Text>
      <View className='border-[1.5px] w-full bg-black-100 h-16 px-5 rounded-2xl border-black-400 focus:border-pink-300 items-center flex-row'>
       <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />
            {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

      </View>

    </View>
  )
}

export default FormField