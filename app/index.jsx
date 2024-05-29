
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";

export default function Page() {
  return (


   
     <SafeAreaView className="bg-primary h-full">

     <ScrollView
       contentContainerStyle={{
         height: "100%",
       }}
     >
       <View className="w-full flex justify-center items-center h-full px-4">
         <Image
           source={images.logo}
           className="w-[130px] h-[84px]"
           resizeMode="contain"
         />
         
         <Image
            source={images.cards}
            className="w-[90%] h-[35%] "
            resizeMode="contain"
          />
        
          <Text className="b-6 font-pbold mx-4 text-white text-2xl text-center">
            Endless Possibilities 
            & The Quest to find real content ends with 
            <Text className="text-secondary-200"> Tora</Text>
          </Text>

          <Text className="text-sm font-pregular text-gray-100 mt-5 text-center mb-5">
            Join a new world of joy
          </Text>

          <CustomButton 
            title="Continue with Email"
            handlePress={()=>{}}
            containerStyle="w-full wt-7"
          />

         </View>

       

    </ScrollView>
    </SafeAreaView>
  );
}

