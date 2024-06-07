import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useAppwrite from "../../lib/useAppwrite";
import { searchPosts } from "../../lib/appwrite";
import  SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import   VideoCard  from "../../components/VideoCard";
const Bookmark = () => {
  const { query } = useLocalSearchParams();
  // const { data: posts, refetch } = useAppwrite(() => searchPosts(query));
  // useEffect(() => {
    //   refetch();
    // }, [query]);
    let posts=null;
    
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
            creator={item.users.username}
            avatar={item.users.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">

              <Text className="text-2xl font-psemibold text-white mt-1">
                Saved Videos
              </Text>

              {/* <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} refetch={refetch} />
              </View> */}
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Go ahead & like a post"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Bookmark;