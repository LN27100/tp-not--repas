import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSignUp } from '@clerk/clerk-react';

export default function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp();

  const handleSignUp = async () => {
    if (signUp) {
      await signUp.create({
        emailAddress: 'user@example.com',
        password: 'password',
      });
    }
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Sign Up Screen</Text>
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
