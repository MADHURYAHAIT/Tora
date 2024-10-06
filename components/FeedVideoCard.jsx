import { useState, useEffect } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import { icons } from "../constants";

import { useAppwrite } from "../lib/useAppwrite";
import { addBookmark, removeBookmark, getBookmarks } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const FeedVideoCard = ({ title, isBookmark, tab, creator, video, avatar, thumbnail, id }) => {
  const { user, isLogged } = useGlobalContext();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false); // Define loading state
  console.log("-----------");
  console.log("data from database", isBookmark);
  // Extract the video ID
  const videoId = id;

  useEffect(() => {
    console.log("Running useEffect:", { user, isLogged, tab, videoId, isBookmark });

    if (isLogged && user) {
      setLoading(true); // Set loading to true
      if (tab === 'bookmark') {
        getBookmarks(user.$id).then((bookmarks) => {
          const bookmarkedVideoIds = bookmarks.map((bookmark) => bookmark.videos.$id);
          setIsBookmarked(bookmarkedVideoIds.includes(videoId));
          console.log("Bookmark status:", bookmarkedVideoIds.includes(videoId)); // Debugging log
        }).catch(error => {
          console.error("Error fetching bookmarks:", error);
        }).finally(() => {
          setLoading(false); // Set loading to false
        });
      } else {
        setIsBookmarked(isBookmark);
        console.log("Setting isBookmarked from isBookmark:", isBookmark); // Debugging log
        setLoading(false); // Set loading to false
      }
    }
  }, [user, isLogged, tab, videoId, isBookmark]);

  useEffect(() => {
    console.log("Updating isBookmark prop:", isBookmarked);
    // Update the isBookmark prop when the isBookmarked state changes
    // You can add code here to update the isBookmark prop
  }, [isBookmarked]);

  const handleBookmark = async () => {
    if (isLogged) {
      try {
        if (isBookmarked) {
          await removeBookmark(user.$id, videoId);
        } else {
          await addBookmark(user.$id, videoId);
        }
        setIsBookmarked(!isBookmarked);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("User is not logged in");
    }
  };

  const [play, setPlay] = useState(false);

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
            className=""
          >
            {console.log("data displayed", isBookmarked)}
            <Image
              source={isBookmarked ? icons.heart : icons.bookmark}
              resizeMode="contain"
              className="w-10 h-8"
            />

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
            className=" w-full h-full rounded-xl mt-3"
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