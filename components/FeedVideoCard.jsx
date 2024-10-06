import { useState, useEffect } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { icons } from "../constants";

import { useAppwrite } from "../lib/useAppwrite";
import { addBookmark, removeBookmark, getBookmarks } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const FeedVideoCard = ({ title, isBookmark, tab, creator, video, avatar, thumbnail, id }) => {
  const { user, isLogged } = useGlobalContext();
  const [isBookmarked, setIsBookmarked] = useState(isBookmark); // use the prop as initial state
  const [loading, setLoading] = useState(false); // Loading state
  const [play, setPlay] = useState(false); // Video play state

  const videoId = id;

  useEffect(() => {
    if (isLogged && user) {
      setLoading(true); // Show loading indicator

      // Fetch all bookmarks once user is logged in
      getBookmarks(user.$id)
        .then((bookmarks) => {
          const bookmarkedVideoIds = bookmarks.map((bookmark) => bookmark.videos.$id);
          setIsBookmarked(bookmarkedVideoIds.includes(videoId)); // Update bookmark state
        })
        .catch((error) => console.error("Error fetching bookmarks:", error))
        .finally(() => setLoading(false)); // Hide loading indicator
    }
  }, [user, isLogged, videoId]);

  const handleBookmark = async () => {
    if (!isLogged) {
      console.log("User is not logged in");
      return;
    }

    setLoading(true); // Show loading indicator while updating

    try {
      if (isBookmarked) {
        await removeBookmark(user.$id, videoId);
      } else {
        await addBookmark(user.$id, videoId);
      }

      // After toggling, fetch updated bookmarks
      const updatedBookmarks = await getBookmarks(user.$id);
      setIsBookmarked(updatedBookmarks.map((b) => b.videos.$id).includes(videoId));
    } catch (error) {
      console.error("Error updating bookmark:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 mt-1 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <View className="flex justify-center items-center flex-row flex-2">
          <TouchableOpacity
            onPress={handleBookmark}
            disabled={loading} // Disable while loading
            className=""
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Image
                source={isBookmarked ? icons.heart : icons.bookmark}
                resizeMode="contain"
                className="w-10 h-8"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FeedVideoCard;
