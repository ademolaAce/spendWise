
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';

import SafeAreaView from '@/components/SafaAreaView';
import { Button } from '@/components/ui/button';

export default function ReportResultScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
      >
        <Text className="text-2xl font-bold text-foreground">
          Report View
        </Text>

        <Button
          className="mt-5"
          onPress={() => router.back()}
        >
          <Text className="font-semibold text-primary-foreground">
            Back to Report
          </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
