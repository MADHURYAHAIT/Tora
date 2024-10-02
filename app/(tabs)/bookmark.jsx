// bookmark.jsx
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import { searchPosts } from "../../lib/appwrite";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmark = () => {
  const { user } = useGlobalContext();
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]);

  const fetchBookmarkedVideos = async () => {
    try {
      const response = await useAppwrite(() => getBookmarkedVideos(user.$id));
      setBookmarkedVideos(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookmarkedVideos();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={bookmarkedVideos}
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
      />
    </SafeAreaView>
  );
};

export default Bookmark;