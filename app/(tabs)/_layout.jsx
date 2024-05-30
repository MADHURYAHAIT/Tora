import { View, Text,Image } from 'react-native'
import React from 'react'
import { Tabs,Redirect } from 'expo-router'
import {icons} from '../../constants/'
const TabIcon =({icon,color,name,focussed})=>{
    return(
        <View className="items-center justify-center gap-3">
            <Image 
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="w-6 h-6"  
            />
            <Text className={`$(focussed ?'font-psmibold' : 'font-pregular') text-xs`} style={{color:color}}>
                {name}
            </Text>
        </View>
    )
}
const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
            tabBarShowLabel:false,
            tabBarActiveTintColor:'#FFA001',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle:{
                backgroundColor:'#161622',
                borderTopWidth:1,
                borderTopColor:'#232533',
                height:80,
                
            }
        }}
        >
        <Tabs.Screen
            name='home'
            options={{
                title:"Home",
                headerShown:false,
                tabBarIcon:({color,focused})=>(
                    <TabIcon
                        icon={icons.home}
                        color={color}
                        name="Home"
                        focussed={focused}
                    />
                )
            }}
        />
         <Tabs.Screen
            name='bookmark'
            options={{
                title:"Bookmark",
                headerShown:false,
                tabBarIcon:({color,focused})=>(
                    <TabIcon
                        icon={icons.bookmark}
                        color={color}
                        name="Bookmark"
                        focussed={focused}
                    />
                )
            }}
        />

        <Tabs.Screen
            name='create'
            options={{
                title:"Create",
                headerShown:false,
                tabBarIcon:({color,focused})=>(
                    <TabIcon
                        icon={icons.plus}
                        color={color}
                        name="Create"
                        focussed={focused}
                    />
                )
            }}
        />

        <Tabs.Screen
            name='profile'
            options={{
                title:"Profile",
                headerShown:false,
                tabBarIcon:({color,focused})=>(
                    <TabIcon
                        icon={icons.profile}
                        color={color}
                        name="Profile"
                        focussed={focused}
                    />
                )
            }}
        />

    
      </Tabs>
    </>
  )
}

export default TabsLayout