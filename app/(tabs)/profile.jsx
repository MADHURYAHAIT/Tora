import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList,RefreshControl, TouchableOpacity, Alert,Text } from "react-native";
import { icons,images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserProf,deleteVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

import EmptyState from "../../components/EmptyState";
import   VideoCard  from "../../components/VideoCard";
import  InfoBox from "../../components/InfoBox";
import { useState } from "react";



const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts , refetch  } = useAppwrite(() => getUserProf(user.$id));
  
  const handleDeleteVideo = async (videoId) => {
    console.log(videoId);
    try {
      await deleteVideo(videoId);
      Alert.alert('Video deleted successfully !')
      // Refresh the posts data
      await refetch();

    } catch (error) {
      console.error(error);
      Alert.alert('Error',error.message)

    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };


  return (
    <SafeAreaView className="bg-primary h-full">

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            onDelete={() => handleDeleteVideo(item.$id)}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this profile"
            buttontxt="Create a Video"
          />
        )}
        ListHeaderComponent={() => (
        
          <View className="my-6 px-4 space-y-6">
            
             <View className="justify-between items-start pb-5 flex-row">
             <View>  
                {/* <Image
                  source={images.logoSmall} 
                  className="w-12 h-12"
                  resizeMode='contain'
                  /> */}
                 <Text className='text-3xl  text-gray-100 mt-2 font-psemibold'>
                   User Profile
                </Text>
              </View>
             

              <View>
              <TouchableOpacity
                    onPress={()=>  router.push("/settings")}
                    className="flex w-full items-end"
                  >
                  <Image 
                      source={icons.setting}
                      resizeMode="contain"
                      className="w-9 h-8"
                      tintColor="#CDCDE0" // change the color to red
                    />

                {/* <Text className='text-4xl  text-gray-100 mt-1 font-psemibold'>
                 ⚙
                </Text> */}

              {/* <Image
                    source={{ uri: user.avatar }}
                    className="w-9 p-4 h-9  rounded-3xl"
                    resizeMode="cover"
                  /> */}
                </TouchableOpacity>
              </View>
              
          
          </View>

            <View className=" w-full flex justify-center items-center mt-6 mb-12 px-4">
          {user? (
                <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center"> 
                  <Image
                    source={{ uri: user.avatar }}
                    className="w-[90%] h-[90%] rounded-lg"
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center"> 
                  {/* You can render a default avatar or a placeholder image here */}
                  <Image
                    source={require('../../assets/appIcons/default-avatar.png')} // Replace with your default avatar image
                    className="w-[90%] h-[90%] rounded-lg"
                    resizeMode="cover"
                  />
                </View>
              )}
            
              {user? (
                <>
                
                <InfoBox
                  title={user.username}
                  containerStyles="mt-5"
                  titleStyles="text-lg"
                />
                <View className="mt-5 flex flex-row">
                <InfoBox
                  title={posts.length || 0}
                  subtitle="Posts"
                  titleStyles="text-xl"
                  containerStyles="mr-10"
                />
                <InfoBox
                  title="1.2k"
                  subtitle="Likes"
                  titleStyles="text-xl"
                />
              </View>
              </>
              ) : (
                <InfoBox
                  title="Unknown"
                  containerStyles="mt-5"
                  titleStyles="text-lg"
                />
              )}
            </View>
        </View>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
    />

  </SafeAreaView>

);

};

export default Profile;