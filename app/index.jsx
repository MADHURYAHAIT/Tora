
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";


export default function Page() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

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
        
          <Text className="b-6 font-pbold mx-5  text-white text-2xl text-center">
            Endless Possibilities 
            & The Quest to find real content ends with 
            <Text className="text-secondary-200"> Tora</Text>
          </Text>

          <Text className="text-sm font-pregular text-gray-100 mt-5 text-center py-3 mb-5">
          Unleash the potential of AI in every share, creating a community driven by curiosity and powered by intelligence.
          </Text>
         
            <CustomButton 
              title="Continue with Email"
              handlePress={()=>router.push('/sign-in')}
              containerStyles='mx-7  w-[95%]'
            />
         </View>

        

        

         {/* <StatusBar backgroundColor="#161622" style="light"/> */}

    </ScrollView>
    </SafeAreaView>
  );
}

