import { View, Text ,Image,ScrollView,Alert} from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants/'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link,router } from 'expo-router'
import { signIn } from '../../lib/appwrite'

const SignIn = () => {
  const[form,setForm]=useState({
    email:'',
    password:''
  })

  const [isSubmitting, setIsSubmitting]=useState(false)
  const Submit = async()=>{
    if (!form.email || !form.password ){
      Alert.alert('Error','Please fill in the fields')
    }
    setIsSubmitting(true);
    try{
      await signIn(form.email, form.password)
      router.replace('/home')

    }catch(error){
      Alert.alert('Error',error.message)
    }finally{
      setIsSubmitting(false)
    }
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[95vh]  px-6  my-6">
          <Image source={images.logo} className="w-[110px] h-[50px]" resizeMode="contain" />
          <Text className='text-2xl text-white text-semibold mt-8 font-psemibold'>Log in to Tora ✨</Text>

          <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e)=>setForm({...form,email:e})}
          otherStyles='mt-7'
          keyboardType="email-address"
          />

      <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e)=>setForm({...form,password:e})}
          otherStyles='mt-7'
          />
      
      <CustomButton 
      title="Sign In"
      handlePress={Submit}
      containerStyles='mt-7'
      isLoading={isSubmitting}
      />

      <View className='justify-center pt-5 flex-row gap-2'>
        <Text className='text-lg text-gray-500 font-pregular'>
          Don't have account?
        </Text>
        <Link href="/sign-up" className='font-psemibold text-lg text-secondary'>Sign Up</Link>
      </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignIn