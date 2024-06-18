import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";

import { icons } from "../constants";



const FeedVideoCard = ({ title, creator, avatar, thumbnail, video }) => {

    const like={

    }

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

          <View className="flex justify-center items-center flex-row flex-2" >
            <TouchableOpacity
              onPress={like}
              className="">
                
                <Image 
                      source={icons.heart}
                      resizeMode="contain"
                       className="w-14 h-14"
                    />

            </TouchableOpacity>
            
          </View>
        </View>

        {play? (
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