import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
         data={[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:89}]}
         keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <Text className="text-3xl text-white">{item.id}</Text>
        )}
        ListHeaderComponent={()=>(
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-3">
              <View>
                <Text className="font-pmedium text-lg text-gray-400">
                  Welcome Back
                </Text>
                <Text className="font-psemibold  text-3xl text-gray-100">
                  Madhurya Hait
                </Text>
              </View>
              <View className="">
                <Image
                source={images.logoSmall} 
                className="w-12 h-12"
                resizeMode='contain'
                />
              </View>
            </View>
            <SearchInput/>
          </View>
        )}
        />
    </SafeAreaView>
  )
}

export default Home