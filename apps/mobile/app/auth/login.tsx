import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'

import { router } from 'expo-router'

import { supabase } from '../../src/lib/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      Alert.alert(error.message)
      return
    }

    router.replace('/tabs')
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        gap: 16,
        backgroundColor: '#fff',
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: '700',
        }}
      >
        Wellness Tracker
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 14,
          borderRadius: 10,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 14,
          borderRadius: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: 'black',
          padding: 16,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: '600',
          }}
        >
          Sign In
        </Text>
      </TouchableOpacity>
    </View>
  )
}