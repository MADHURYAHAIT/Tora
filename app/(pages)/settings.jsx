import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut, updateUsername, updateAvatar, uploadFile, getFilePreview } from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import * as ImagePicker from 'expo-image-picker'

const Setting = () => {

  const { user, setUser, setIsLogged } = useGlobalContext();

  const [form, setForm] = useState({ name: '', avatar: null });

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

  const updateUserName = async () => {
    try {
      const updatedUser = await updateUsername(form.name);
      if (updatedUser) {
        setUser(updatedUser);
        Alert.alert('Username updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update username');
}
    } catch (error) {
      console.error(error);
    }
  };

  const handlePress = () => {
    if (form.avatar) {
      updateAvatarPic(form.avatar);
    }
  };

  const updateAvatarPic = async (avatar) => {
    try {
      const uploadedFileUrl = await uploadFile(avatar, 'image');
      const url = new URL(uploadedFileUrl);
      const filePath = url.pathname.split('/');
      const fileId = filePath[filePath.length - 2]; 
      console.log(fileId)

      // const avatarUrl = await getFilePreview(fileId, 'image');

      const updatedUser = await updateAvatar(url);
      if (updatedUser) {
        setUser(updatedUser);
        Alert.alert('Avatar updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update avatar');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

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
            handleChangeText={(e)=>setForm({...form,name:e})}
            otherStyles='mt-10'
          />
          <CustomButton
            title={'Update changes'}
            handlePress={updateUserName}
            containerStyles='mt-6'
          />
          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-pmedium">
              Avatar Image
            </Text>

            <TouchableOpacity onPress={() => openPicker('image')}>
              {form.avatar ? (
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
            handlePress={handlePress}
            containerStyles="mt-8 mb-3"
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

export default Setting;