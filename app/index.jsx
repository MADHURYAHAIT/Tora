import { Text, View } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "react-native-web";
export default function Page() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
 
        <Text className="color-white">Hello ! World</Text>
        <StatusBar style="auto"/>
        <Link href={"/profile"}>Go To Profile</Link>

    </View>
  );
}

