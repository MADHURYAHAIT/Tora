// bookmark.jsx
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { getBookmarkedVideos } from "../../lib/appwrite";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import FeedVideoCard from "../../components/FeedVideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: bookmarkedVideos, loading, refetch } = useAppwrite(() => getBookmarkedVideos({ equals: user.$id }));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
  }, [user]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={bookmarkedVideos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <FeedVideoCard
            user={user}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            id={item.$id}
            tab={"bookmark"}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="text-3xl text-gray-100 mt-2 font-psemibold">
                Saved Videos
              </Text>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Go ahead & like a post"
            buttontxt="Add A Bookmark Now"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Bookmark;