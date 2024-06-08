import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { searchPosts, signOut } from "../../lib/appwrite";
import  SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import   VideoCard  from "../../components/VideoCard";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import * as ImagePicker from 'expo-image-picker'

const Bookmark = () => {
  const { query } = useLocalSearchParams();
  const { user, setUser, setIsLogged } = useGlobalContext();
  const openPicker = async (selectType) => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType==='image'?
      ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect:[4,3],
      quality:1,
    });
    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          avatar: result.assets[0],
        });
      }

    } 
  }


    const logout = async () => {
      await signOut();
      setUser(null);
      setIsLogged(false);
  
      router.replace("/sign-in");
    };
    
    const[form,setForm]=useState({
      name:'',
      avatar:null,
    })
    
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="flex my-6 px-1">
        <View >
          <Text className="text-2xl font-psemibold px-2 text-white mt-1">
            Settings
          </Text>
        </View>
        <View  className="flex px-3">

        <FormField
          title="User Name"
          value={form.name}
          placeholder="Change your existing user name..."
          handleChangeText={(e)=>setForm({...form,title:e})}
          otherStyles='mt-10'
          />

          <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                      Avatar Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker('image')}>
                      {form.thumbnail ? (
                        <Image
                          source={{ uri: form.avatar.uri }}
                          resizeMode="cover"
                          className="w-full h-64 rounded-2xl"
                        />
                      ) : (
                        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                          <Image
                            source={icons.upload}
                            resizeMode="contain"
                            alt="upload"
                            className="w-5 h-5"
                          />
                          <Text className="text-sm text-gray-100 font-pmedium">
                            Choose a file
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
          <CustomButton
          title="Update Changes"
          handlePress={null}
          containerStyles="mt-8 mb-3"
          // isLoading={uploading}
        />

          <Text className="text-base mt-20  text-gray-100 font-pmedium">
              Come Back later ?           
          </Text>

          <CustomButton
              title={'Logout'}
              handlePress={logout}
              containerStyles='mt-6'
              
              />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bookmark;