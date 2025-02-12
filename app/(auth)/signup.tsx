import React from 'react';
import { View, Text, Button } from 'react-native';
import { useSignUp } from '@clerk/clerk-react';

export default function SignUpScreen() {
  const { signUp } = useSignUp();

  const handleSignUp = async () => {
    await signUp.create({
      emailAddress: 'user@example.com',
      password: 'password',
    });
  };

  return (
    <View>
      <Text>Sign Up Screen</Text>
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
