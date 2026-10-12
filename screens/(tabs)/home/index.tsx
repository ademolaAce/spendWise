
import React from 'react';
import { ActivityIndicator, Text, View, Pressable, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import {
  UserRound,
  ShieldCheck,
  Bell,
  Info,
  ChevronRight,
  Settings,
  LogOut,
  Building2,
} from 'lucide-react-native';

import SafeAreaView from '@/components/SafaAreaView';
import LogoutButton from '@/components/logout-button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const [username, setUsername] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const storedUsername = await SecureStore.getItemAsync('username');

        if (!storedUsername) {
          Alert.alert('Error', 'No username found. Please sign in again.');
        }

        if (mounted) setUsername(storedUsername);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load profile.'
          );
        }
      } finally {
        if (mounted) 
          setLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const settings = [
    {
      title: 'Personal Information',
      subtitle: 'View your account details',
      Icon: UserRound,
      route: '/personal-information',
    },
    {
      title: 'Security',
      subtitle: 'Password and two-factor authentication',
      Icon: ShieldCheck,
      route: '/security',
    },
    {
      title: 'Notifications',
      subtitle: 'Manage your preferences',
      Icon: Bell,
      route: '/notifications',
    },
    {
      title: 'About',
      subtitle: 'App version and information',
      Icon: Info,
      route: '/about',
    },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-muted-foreground">
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5">
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">
            My Profile
          </Text>

          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-muted text-red-500"
            onPress={() => router.push('/settings')}
          >
            <Settings size={22} color="#64748B" />
          </Pressable>
        </View>

        <View className="mb-7 flex-row items-center gap-4">
          <Avatar alt="User avatar" className="h-20 w-20">
            <AvatarFallback>
              <Text className="text-xl font-bold text-foreground">
                {username?.slice(0, 2).toUpperCase() || 'AA'}
              </Text>
            </AvatarFallback>
          </Avatar>

          <View className="flex-1 gap-1">
            <Text className="text-xl font-bold text-foreground font-uppercase" numberOfLines={1}>
              {username}
            </Text>
            <Text className="text-sm text-muted-foreground">
              Signed-in user
            </Text>

            <View className="mt-1 flex-row items-center gap-2">
              <Building2 size={16} color="#64748B" />
              <Text className="text-sm text-muted-foreground">
                SpendWise account
              </Text>
            </View>
          </View>
        </View>

        <Card className="rounded-2xl border border-border bg-card">
          <CardContent className="px-4 py-1">
            {settings.map(({ title, subtitle, Icon, route }, index) => (
              <View key={title}>
                <Pressable
                  className="flex-row items-center gap-3 py-4"
                  onPress={() => router.push(route as never)}
                >
                  <View className="h-11 w-11 items-center justify-center rounded-xl bg-muted">
                    <Icon size={22} color="#6366F1" />
                  </View>

                  <View className="flex-1 gap-1">
                    <Text className="font-semibold text-foreground">
                      {title}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {subtitle}
                    </Text>
                  </View>

                  <ChevronRight size={20} color="#94A3B8" />
                </Pressable>

                {index < settings.length - 1 && (
                  <Separator className="bg-border" />
                )}
              </View>
            ))}

            <Separator className="bg-border" />

            <View className="flex-row items-center gap-3 py-4">
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
                <LogOut size={22} color="#E11D48" />
              </View>

              <View className="flex-1">
                <Text className="font-semibold text-foreground">
                  Log Out
                </Text>
                <Text className="text-sm text-muted-foreground">
                  Sign out of your account
                </Text>
              </View>

              <LogoutButton />
            </View>
          </CardContent>
        </Card>

        <Text className="mt-5 text-center text-xs text-muted-foreground">
          SpendWise v1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}
