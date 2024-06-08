import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";

import { icons } from "../constants";

const VideoCard = ({ title, creator, avatar, thumbnail, video, onDelete }) => {
  const [play, setPlay] = useState(false);

  return (

      <View className="flex flex-col items-center px-4 mb-14">
        <View className="flex flex-row gap-3 items-start">
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

          <View className="pt-2">
            <Menu>
              <MenuTrigger>
                <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
              </MenuTrigger>
              <MenuOptions >
                <View className='py-5 mx-3'>

                 <MenuOption className='text-center justify-center flex-1 'onSelect={() => console.log("Like button pressed")}>
                  <Text className='font-psemibold text-sm'>Like</Text>
                </MenuOption>
                <MenuOption className='text-center justify-center flex-1 ' onSelect={() => onDelete()}>
                  <Text className='font-psemibold text-sm'>Delete</Text>
                </MenuOption>
                </View>
              </MenuOptions>
            </Menu>
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

export default VideoCard;