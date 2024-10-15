// Bookmark.js
import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { getBookmarkedVideos,getAllPosts } from "../../lib/appwrite";
import EmptyState from "../../components/EmptyState";
import FeedVideoCard from "../../components/FeedVideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useNavigation } from '@react-navigation/native';

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: bookmarkedVideos, loading, refetch, error } = useAppwrite(() => getBookmarkedVideos({ equals: user.$id }));
  const { data: posts, refetch: refetchHome } = useAppwrite(() => getAllPosts(user?.$id));
  const [refreshing, setRefreshing] = useState(false);
  const [isBookmark, setIsBookmark] = useState({});

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refetchHome(); // Refetch home data
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
  }, [user]);

  const handleBookmark = async (videoId) => {
    // Your bookmark logic here
    await refetchHome(); // Refetch home data after bookmarking
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={bookmarkedVideos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <FeedVideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={ item.creator.avatar}
            id={item.$id}
            isBookmark={isBookmark[item.$id]}
            setIsBookmark={setIsBookmark}
            tab={"bookmark"} // Keep the tab functionality
            onBookmark={handleBookmark} // Pass the handleBookmark function
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4">
            <Text className="text-3xl text-gray-100 mt-2 font-psemibold">
              Saved Videos
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Go ahead & like a post"
            buttontxt="Add a Bookmark Now"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Bookmark;