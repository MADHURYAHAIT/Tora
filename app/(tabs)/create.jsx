import { View, Text, ScrollView, TouchableOpacity,Image,Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { icons } from '../../constants'
import { Video,ResizeMode } from 'expo-av'
import CustomButton from '../../components/CustomButton'
import * as DocumentPicker from "expo-document-picker";
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { Link,router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

const Create = () => {
  const {user} =useGlobalContext(); 
  const openPicker = async (selectType) => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType==='image'?
      ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect:[4,3],
      quality:1,
    });


    // const result = await DocumentPicker.getDocumentAsync({
    //   type:selectType === "image"
    //       ? ["image/png", "image/jpeg"]
    //       : ["video/mp4", "video/gif"]
    // });
    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } 
    // else {
    //   setTimeout(() => {
    //     Alert.alert("Document picked", JSON.stringify(result, null, 2));
    //   }, 100);
    // }
  };



  const submit= async()=>{

    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail |
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    } 

    setUploading(true);
    
    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }

  }
  
  const[uploading,setUploading]=useState(false)
  const[form,setForm]=useState({
    title:'',
    video:null,
    thumbnail:null,
    prompt:''
  })
  return (
   <SafeAreaView className='bg-primary h-full '>
    <ScrollView className='px-4 my-6 pt-2'>
      <Text className='text-3xl text-white font-psemibold'>
        Upload Video
      </Text>

      <FormField
      title="Video Title"
      value={form.title}
      placeholder="Give your video a title..."
      handleChangeText={(e)=>setForm({...form,title:e})}
      otherStyles='mt-10'
      />

      <View>
        <Text className="text-base text-gray-100 font-pmedium my-6 pt-3 ">
          Upload Video
        </Text>
        <TouchableOpacity onPress={() => openPicker("video")}>
        {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"

                resizeMode={ResizeMode.COVER}

              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
        </TouchableOpacity>
      </View>
        
      <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
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

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7 mb-3"
          isLoading={uploading}
        />


    </ScrollView>
  </SafeAreaView>
  )
}

export default Create