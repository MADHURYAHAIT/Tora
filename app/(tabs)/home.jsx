import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'


const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  console.log(posts);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
         data={posts}
         keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <Text className="text-3xl text-white">{item.title}</Text>
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
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 font-pregul ar mb-3 text-lg">
                Trending Videos
              </Text>
              <Trending post={[{id:1},{id:2},{id:3}]??[]}/>
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