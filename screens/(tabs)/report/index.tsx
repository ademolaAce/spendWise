import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  RefreshControl,
  Alert,
  Pressable,
} from 'react-native';

import SafeAreaView from '@/components/SafaAreaView';
import { getallReport } from '@/service/report';
import { router } from 'expo-router';

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

export interface ReportParameter {
  id: number;
  parameterId: number;
  parameterName: string;
}

const ReportPage = () => {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const reportData = await getallReport();

      const reportList: Report[] = Array.isArray(reportData)
        ? reportData
        : Array.isArray(reportData?.data)
          ? reportData.data
          : [];

      setReports(reportList);
    } catch (err) {
      const message = 'Unable to load reports. Please try again.';

      setError(message);
      console.error('Failed to fetch reports:', err);

      if (!isRefresh) {
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-foreground">
          Loading reports...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-foreground">
          Reports
        </Text>

        <Text className="mt-1 text-sm text-muted-foreground">
          View your available reports
        </Text>

        <Text className="mt-2 text-xs text-muted-foreground">
          {reports.length}{' '}
          {reports.length === 1 ? 'report' : 'reports'} available
        </Text>
      </View>

      {error && reports.length === 0 ? (
        <View className="flex-1 items-center justify-center px-5">
          <Text className="mb-3 text-center text-foreground">
            {error}
          </Text>

          <Pressable
            onPress={() => fetchReports()}
            className="rounded-lg bg-primary px-5 py-3"
          >
            <Text className="font-semibold text-primary-foreground">
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          {error ? (
            <View className="mx-5 mb-2 rounded-lg border border-border p-3">
              <Text className="text-sm text-foreground">
                Could not refresh reports. Pull down to try again.
              </Text>
            </View>
          ) : null}

          <FlatList
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 24,
              flexGrow: 1,
            }}
            data={reports}
            keyExtractor={(item, index) =>
              String(item.id ?? index)
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchReports(true)}
              />
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-12">
                <Text className="text-base font-semibold text-foreground">
                  No reports available
                </Text>

                <Text className="mt-2 text-center text-sm text-muted-foreground">
                  Pull down to refresh the report list.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  if (!item.useReport) {
                    Alert.alert(
                      'Report unavailable',
                      'This report cannot be used at the moment.'
                    );
                    return;
                  }

                  router.push({
                    pathname: '/report/[id]',
                    params: {
                      id: String(item.id),
                    },
                  });
                }}
                className="mb-3 rounded-xl border border-border bg-card p-4"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-bold text-foreground">
                      {item.reportName || 'Unnamed Report'}
                    </Text>

                    <Text className="mt-1 text-sm text-muted-foreground">
                      {item.reportType || 'Report'}
                    </Text>
                  </View>

                  <View className="rounded-full bg-primary/10 px-3 py-1">
                    <Text className="text-xs font-medium text-primary">
                      {item.useReport ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                </View>

                {item.reportCategory ? (
                  <Text className="mt-3 text-xs text-muted-foreground">
                    Category: {item.reportCategory}
                  </Text>
                ) : null}

                {item.description ? (
                  <Text className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </Text>
                ) : null}

                <View className="mt-4 flex-row items-center justify-between">
                  <Text className="text-xs text-muted-foreground">
                    {item.reportParameters?.length ?? 0}{' '}
                    {(item.reportParameters?.length ?? 0) === 1
                      ? 'parameter'
                      : 'parameters'}
                  </Text>

                  <Text className="text-sm font-semibold text-primary">
                    View report →
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default ReportPage;