import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';

export default function LoginScreen() {
  const { signIn, isLoaded } = useSignIn();

  const handleLogin = async () => {
    if (signIn && isLoaded) {
      await signIn.create({
        strategy: 'oauth_google',
        redirectUrl: 'tp-note-repas://oauth-callback',
      });
    }
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <Button title="Login with Google" onPress={handleLogin} />
    </View>
  );
}
