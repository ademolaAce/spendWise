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
import { forgetPassword } from '@/service/auth';
import React from 'react';
import { Alert, View } from 'react-native';

export function ResetPasswordForm() {
  const [username, setUsername] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function onSubmit() {
    if (!username.trim()) {
      Alert.alert('Required', 'Please enter your username.');
      return;
    }

    try {
      setLoading(true);

      await forgetPassword(username.trim());

      Alert.alert(
        'Password reset',
        'If the username exists, password reset instructions have been sent.'
      );
    } catch (error) {
      console.error('Password reset error:', error);

      Alert.alert(
        'Reset failed',
        error instanceof Error
          ? error.message || 'Unable to reset password. Please try again.'
          : 'Unable to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="items-center justify-center">
      <Card className="w-full border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            <Text>Reset password</Text>
          </CardTitle>

          <CardDescription className="text-center sm:text-left">
            <Text>
              Enter your username to reset your password
            </Text>
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="username">
                <Text>Username</Text>
              </Label>

              <Input
                id="username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                keyboardType="default"
                autoComplete="username"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
              />
            </View>

            <Button
              className="w-full"
              onPress={onSubmit}
              disabled={loading}
            >
              <Text>
                {loading ? 'Sending...' : 'Reset your password'}
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}