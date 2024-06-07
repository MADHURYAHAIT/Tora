import { useEffect } from "react";
import { router } from "expo-router";
import { View, Text, FlatList,TouchableOpacity ,Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { getUserProf, searchPosts, signOut } from "../../lib/appwrite";
import  SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import   VideoCard  from "../../components/VideoCard";
import {useGlobalContext} from '../../context/GlobalProvider'
import  InfoBox from "../../components/InfoBox";
import {icons} from '../../constants'

const Profile = () => {
  const {user,setUser, setIsLogged}= useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserProf(user.$id));
  // console.log(user.$id);

  const logout = async () => {
    await signOut(); 
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
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
        />
      )}
      ListEmptyComponent={() => (
        <EmptyState
          title="No Videos Found"
          subtitle="No videos found for this profile"
        />
      )}
      ListHeaderComponent={() => (
        <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
          <TouchableOpacity
            onPress={logout}
            className="flex w-full items-end mb-10"
          >
         <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
          </TouchableOpacity>

          <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
            <Image
              source={{ uri: user? user.avatar:null}}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode="cover"
            />
          </View>

          <InfoBox
            title={user? user.username : null}
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
              title="1.2M"
              subtitle="Followers"
              titleStyles="text-xl"
            />
          </View>
        </View>
      )}
    />
  </SafeAreaView>
);

};

export default Profile;