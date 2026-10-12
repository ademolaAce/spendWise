import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

import { login } from '@/service/auth';
import { router } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  type TextInput,
  View,
} from 'react-native';

import SafeAreaView from './SafaAreaView';

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function onSubmit() {
    if (!username.trim()) {
      Alert.alert('Required', 'Please enter your username.');
      return;
    }

    if (!password) {
      Alert.alert('Required', 'Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      const data = await login(username.trim(), password);

      if (data.isTwoFactorAuthenticationRequired) {
        router.navigate({
          pathname: '/(auth)/twoFactorAuth',
          params: {
            username: username.trim(),
          },
        });

        return;
      }

      Alert.alert('Success', 'You have successfully signed in.');

      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert(
        'Login failed',
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background px-4">
      <Card className="w-full border-border/0 shadow-none sm:border-border sm:shadow-sm">
        <CardHeader className="items-center">
          <Image
            source={require('@/assets/images/logo.png')}
            className="h-40 w-40"
            resizeMode="cover"
          />

          <CardTitle className="text-xl sm:text-left">
            <Text className="text-2xl text-red-700">
              Sign in to your app
            </Text>
          </CardTitle>

          <CardDescription className="text-left">
            <Text className="text-xl font-bold text-black dark:text-white">
              Welcome back! Please sign in to continue
            </Text>
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="username">
                <Text className="text-black dark:text-white">
                  Username
                </Text>
              </Label>

              <Input
                id="username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                editable={!loading}
                onSubmitEditing={() =>
                  passwordInputRef.current?.focus()
                }
              />
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Label htmlFor="password">
                  <Text className="text-black dark:text-white">
                    Password
                  </Text>
                </Label>

                <Pressable
                  disabled={loading}
                  onPress={() =>
                    router.push('/(auth)/resetPassword')
                  }
                >
                  <Text className="text-sm leading-4 text-blue-500">
                    Forgot your password?
                  </Text>
                </Pressable>
              </View>

              <Input
                ref={passwordInputRef}
                id="password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="current-password"
                returnKeyType="send"
                editable={!loading}
                onSubmitEditing={onSubmit}
              />
            </View>

            <Button
              className="w-full"
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" />
                  <Text className="text-black dark:text-white">
                    Signing in...
                  </Text>
                </View>
              ) : (
                <Text className="text-black dark:text-white">
                  Continue
                </Text>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}