
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import SafeAreaView from '@/components/SafaAreaView';
import { getallReport } from '@/service/report';

type ReportParameter = {
  id: number;
  parameterId: number;
  parameterName: string;
};

type Report = {
  id: string | number;
  reportName: string;
  reportType: string;
  reportCategory: string;
  description: string;
  coreReport: boolean;
  useReport: boolean;
  reportParameters: ReportParameter[];
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : 'Unable to load reports. Please try again.';

function extractReports(response: any): Report[] {
  const data = response?.data ?? response;

  if (Array.isArray(data)) return data as Report[];
  if (Array.isArray(data?.pageItems)) return data.pageItems as Report[];
  if (Array.isArray(data?.reports)) return data.reports as Report[];

  throw new Error('Unexpected reports response format.');
}

const ReportPage = () => {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchReports = React.useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await getallReport();
      const data = extractReports(response);

      setReports(data);
    } catch (err) {
      const message = getErrorMessage(err);

      console.error('Failed to fetch reports:', err);
      setError(message);

      if (!isRefresh) {
        Alert.alert('Unable to load reports', message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const openReport = (report: Report) => {
    // if (!report.useReport) {
    //   Alert.alert(
    //     'Report unavailable',
    //     'This report cannot be used at the moment.',
    //   );
    //   return;
    // }

    router.push({
      pathname: '/report/[id]',
      params: { id: String(report.id) },
    });
  };

  const availableCount = reports.filter(
    (report) => report.useReport,
  ).length;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>

        <Text className="mt-4 text-base font-semibold text-foreground">
          Loading reports
        </Text>

        <Text className="mt-1 text-sm text-muted-foreground">
          Getting your reports ready...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={reports}
        keyExtractor={(item, index) => String(item.id ?? index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 36,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void fetchReports(true)}
            tintColor="#6366F1"
          />
        }
        ListHeaderComponent={
          <View>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-semibold uppercase tracking-widest text-primary">
                  WORKSPACE
                </Text>

                <Text className="mt-2 text-3xl font-bold text-foreground">
                  Reports
                </Text>

                <Text className="mt-2 text-sm leading-5 text-muted-foreground">
                  Access your reports and select one to view its details
                  and run it.
                </Text>
              </View>
            </View>

            <View className="mt-3 flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-border bg-card p-4">
                <View className="h-7 w-7 items-center justify-center rounded-xl bg-primary/10">
                  <Ionicons name="documents-outline" size={21} color="#6366F1"
                  />
                </View>

                <Text className="mt-4 text-2xl font-bold text-foreground">
                  {reports.length}
                </Text>

                <Text className="mt-1 text-xs text-muted-foreground">
                  Total reports
                </Text>
              </View>

              <View className="flex-1 rounded-2xl border border-border bg-card p-4">
                <View className="h-7 w-7 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={21}
                    color="#16A34A"
                  />
                </View>

                <Text className="mt-4 text-2xl font-bold text-foreground">
                  {availableCount}
                </Text>

                <Text className="mt-1 text-xs text-muted-foreground">
                  Available
                </Text>
              </View>
            </View>

            <View className="mb-4 mt-8 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-xl font-bold text-foreground">
                  All Reports
                </Text>

                <Text className="mt-1 text-sm text-muted-foreground">
                  Tap any report to continue.
                </Text>
              </View>

              <View className="rounded-full bg-primary/10 px-3 py-2">
                <Text className="text-xs font-semibold text-primary">
                  {reports.length} reports
                </Text>
              </View>
            </View>

            {/* Error message */}
            {error && (
              <View className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                <View className="flex-row items-center">
                  <Ionicons
                    name="alert-circle-outline"
                    size={22}
                    color="#DC2626"
                  />

                  <Text className="ml-2 flex-1 font-semibold text-red-600">
                    Unable to load reports
                  </Text>
                </View>

                <Text className="mt-2 text-sm text-red-600">
                  {error}
                </Text>

                <Pressable
                  onPress={() => void fetchReports()}
                  className="mt-3 self-start rounded-lg bg-red-600 px-4 py-2"
                >
                  <Text className="font-semibold text-white">
                    Try again
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center rounded-2xl border border-dashed border-border px-6 py-12">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Ionicons
                name="document-text-outline"
                size={32}
                color="#6366F1"
              />
            </View>

            <Text className="mt-4 text-lg font-bold text-foreground">
              {error ? 'Reports unavailable' : 'No reports found'}
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground">
              {error
                ? 'Check your connection and try again.'
                : 'Pull down to refresh or check again later.'}
            </Text>

            {error && (
              <Pressable
                onPress={() => void fetchReports()}
                className="mt-4 rounded-xl bg-primary px-5 py-3"
              >
                <Text className="font-semibold text-primary-foreground">
                  Reload reports
                </Text>
              </Pressable>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const parameterCount = item.reportParameters?.length ?? 0;
          console.log('para', parameterCount)

          return (
            <Pressable
              onPress={() => openReport(item)}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.reportName || 'report'}`}
              accessibilityState={{
                disabled: !item.useReport,
              }}
              className="mb-4 rounded-2xl border border-border bg-card p-4 active:opacity-70"
            >
              <View className="flex-row items-start gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Ionicons
                    name={
                      item.coreReport
                        ? 'shield-checkmark-outline'
                        : 'document-text-outline'
                    }
                    size={24}
                    color="#6366F1"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-bold leading-5 text-foreground">
                    {item.reportName || 'Unnamed Report'}
                  </Text>

                  <Text className="mt-1 text-sm text-muted-foreground">
                    {item.reportType || 'General report'}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color="#888888"
                />
              </View>

              {!!item.description && (
                <Text
                  className="mt-3 text-sm leading-5 text-muted-foreground"
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              )}

              <View className="my-4 h-px bg-border" />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons
                    name="options-outline"
                    size={16}
                    color="#888888"
                  />

                  <Text className="ml-2 text-xs text-muted-foreground">
                    {parameterCount}{' '}parameters
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View
                    className={`mr-2 h-2 w-2 rounded-full ${
                      item.useReport ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />

                  <Text
                    className={`text-xs font-medium ${
                      item.useReport
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {item.useReport ? 'Available' : 'Unavailable'}
                  </Text>
                </View>
              </View>

              {/* <View className="mt-4 flex-row items-center justify-center rounded-xl bg-primary/10 py-3">
                <Text className="font-semibold text-primary">
                  {item.useReport ? 'View Report' : 'Currently Unavailable'}
                </Text>

                <Ionicons
                  name={
                    item.useReport
                      ? 'arrow-forward'
                      : 'lock-closed-outline'
                  }
                  size={17}
                  color="#6366F1"
                  style={{ marginLeft: 8 }}
                />
              </View> */}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default ReportPage;
