// FeedVideoCard.jsx
import { useState, useEffect } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { icons } from "../constants";
import { addBookmark, removeBookmark, getBookmarks } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const FeedVideoCard = ({ title, isBookmark, tab, creator, video, avatar, thumbnail, id, setIsBookmark, onBookmark = () => {} }) => {
  // console.log("--------------------------------------");
  //console.log("backend data",isBookmark);
  const { user, isLogged } = useGlobalContext();
  const [isBookmarked, setIsBookmarked] = useState(isBookmark !== undefined ? isBookmark : false);
  const [loading, setLoading] = useState(false);
  const [play, setPlay] = useState(false);
  const videoId = id;
 // console.log("front end displayed data",isBookmarked);

  useEffect(() => {
    // If user is logged in, check the bookmark status
    const fetchBookmarks = async () => {
      if (isLogged && user) {
        setLoading(true);
        try {
          if (tab === 'bookmark') {
            const bookmarks = await getBookmarks(user.$id);
            const bookmarkedVideoIds = bookmarks.map((bookmark) => bookmark.videos.$id);
            setIsBookmarked(bookmarkedVideoIds.includes(videoId));
          } else {
            setIsBookmarked(isBookmark !== undefined ? isBookmark : false);
          }
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchBookmarks();
  }, [user, isLogged, videoId, tab, isBookmark]);

useEffect(() => {
  // Update the isBookmark prop when the isBookmarked state changes
  setIsBookmark(isBookmarked);
}, [isBookmarked]);

  const handleBookmark = async () => {
    if (!isLogged) {
      console.log("User   is not logged in");
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(user.$id, videoId);
        setIsBookmarked(false); // Update state immediately
      } else {
        await addBookmark(user.$id, videoId);
        setIsBookmarked(true); // Update state immediately
      }
      onBookmark(videoId); // Call the onBookmark function
    } catch (error) {
      console.error("Error updating bookmark:", error);
    } finally {
      setLoading(false);
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
            <Text className="font-psemibold text-sm text-white" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {creator}
            </Text>
          </View>
        </View>

        <View className="flex justify-center items-center flex-row flex-2">
        <TouchableOpacity onPress={handleBookmark} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#CDCDE0" />
        ) : (
          <Image
            source={isBookmarked ? icons.booked : icons.unbooked}
            resizeMode="contain"
            className="w-10 h-8"
            style={{ tintColor: isBookmarked ? "#FFA001" : "#CDCDE0" }}
          />
        )}
      </TouchableOpacity>
    </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode ={ResizeMode.CONTAIN}
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
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
};


export default FeedVideoCard;