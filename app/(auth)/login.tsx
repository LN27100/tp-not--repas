import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSignIn } from '@clerk/clerk-react';

export default function LoginScreen() {
  const { signIn } = useSignIn();

  const handleLogin = async () => {
    await signIn.create({
      strategy: 'oauth_google',
    });
  };

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Login with Google" onPress={handleLogin} />
    </View>
  );
}
