import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const { user, setUser, setIsLogged } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  // console.log(posts);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
         data={posts}
         keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <VideoCard
          title={item.title}
          thumbnail={item.thumbnail}
          video={item.video}
          creator={item.creator.username}
          avatar={item.creator.avatar}/>
          )}
        
        ListHeaderComponent={()=>(
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-3">
              <View>
                <Text className="font-pmedium text-lg text-gray-400">
                  Welcome back,
                </Text>
                <Text className="font-psemibold  text-3xl text-gray-100">
                 {user?.username}
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
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 font-pregul ar mb-3 text-lg">
                Latest Videos
              </Text>
              <Trending post={latestPosts}/>
            </View>
          </View>
        )}
        ListEmptyComponent={()=>(
          <EmptyState
          title="No Videos Found"
          subtitle="Be the first to create"
          />
        )}

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        />
    </SafeAreaView>
  )
}

export default Home