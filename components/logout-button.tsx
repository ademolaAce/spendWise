import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { logout } from '@/service/auth';
import { router } from 'expo-router';
import { Alert } from 'react-native';

export default function LogoutButton() {
  async function handleLogout() {
    try {
      await logout();

      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout error:', error);

      Alert.alert(
        'Logout failed',
        'Unable to log out. Please try again.'
      );
    }
  }

  return (
    <Button onPress={handleLogout}>
      <Text>Logout</Text>
    </Button>
  );
}