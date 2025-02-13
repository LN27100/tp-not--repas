import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useSignUp, useSignIn } from '@clerk/clerk-expo';

export default function SignUpScreen() {
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignUp = async () => {
    if (!isSignUpLoaded || !isSignInLoaded) return;
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      if (signIn) {
        await signIn.create({
          identifier: email,
          password,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isSignUpLoaded || !isSignInLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
});
