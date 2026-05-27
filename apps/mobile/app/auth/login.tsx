import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'

import { router } from 'expo-router'

import { useAuth } from '../../src/hooks/useAuth'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, loading } = useAuth()

  async function handleLogin() {
    try {
      await signIn(email, password)
      router.replace('/tabs')
    } catch (error: any) {
      Alert.alert(error.message)
    }
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
        disabled={loading}
        style={{
          backgroundColor: loading ? '#555' : 'black',
          padding: 16,
          borderRadius: 10,
          alignItems: 'center',
          opacity: loading ? 0.7 : 1,
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