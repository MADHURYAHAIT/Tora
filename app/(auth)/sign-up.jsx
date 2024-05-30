import { View, Text ,Image,ScrollView, Alert} from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants/'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link,router } from 'expo-router'
import { createUser } from '../../lib/appwrite'

const SignUp = () => {
  const[form,setForm]=useState({
    username:'',
    age:'',
    email:'',
    password:''
  })

  const [isSubmitting, setIsSubmitting]=useState(false)
  const Submit = async()=>{
    if (!form.username || !form.email || !form.password || !form.age){
      Alert.alert('Error','Please fill in the fields')
    }
    setIsSubmitting(true);
    try{
      const result=await createUser(form.email, form.password, form.username, form.age)
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
          <Text className='text-2xl text-white text-semibold mt-7 font-psemibold'>Create a new Account 💖</Text>

          <FormField
          title="Username"
          value={form.username}
          handleChangeText={(e)=>setForm({...form,username:e})}
          otherStyles='mt-7'
          />
          <FormField
          title="Age"
          value={form.age}
          handleChangeText={(e)=>setForm({...form,age:e})}
          otherStyles='mt-5'
          />

          <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e)=>setForm({...form,email:e})}
          otherStyles='mt-5'
          keyboardType="email-address"
          />

      <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e)=>setForm({...form,password:e})}
          otherStyles='mt-5'
          />
      
      <CustomButton 
      title="Sign Up"
      handlePress={Submit}
      containerStyles='mt-7'
      isLoading={isSubmitting}
      />

      <View className='justify-center pt-5 flex-row gap-2'>
        <Text className='text-lg text-gray-500 font-pregular'>
          Have an account already?
        </Text>
        <Link href="/sign-in" className='font-psemibold text-lg text-secondary'>Sign In</Link>
      </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
  
}

export default SignUp