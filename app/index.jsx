import { Text, View } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "react-native-web";
export default function Page() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
 
        <Text className="color-white font-pblack text-3xl">Tora !</Text>
        <StatusBar style="auto"/>
        <Link href={"/home"}>Go To Home</Link>

    </View>
  );
}

