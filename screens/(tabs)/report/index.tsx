import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  RefreshControl,
} from 'react-native';

import SafeAreaView from '@/components/SafaAreaView';
import { getallReport } from '@/service/report';

const ReportPage = () => {
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchReports = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      const reportData = await getallReport();

      console.log('Report Data:', reportData);

      // Adjust this depending on the response returned by getallReport().
      const reportList = Array.isArray(reportData)
        ? reportData
        : reportData?.data ?? [];

      setReports(reportList);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Unable to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

React.useEffect(() => {
    fetchReports();
  }, []);

  // if (loading) {
  //   return (
  //     <SafeAreaView className="flex-1 items-center justify-center bg-background">
  //       <ActivityIndicator size="large" />
  //       <Text className="mt-3 text-foreground">
  //         Loading reports...
  //       </Text>
  //     </SafeAreaView>
  //   );
  // }

  // if (error) {
  //   return (
  //     <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
  //       <Text className="mb-4 text-center text-foreground">
  //         {error}
  //       </Text>

  //       <Text
  //         className="font-semibold text-primary"
  //         onPress={() => fetchReports()}
  //       >
  //         Try again
  //       </Text>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView>
      <View className="px-5 py-4">
        <Text className="text-2xl font-bold text-foreground">
          Reports
        </Text>

        <Text className="mt-1 text-sm text-muted-foreground">
          View your available reports
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ReportPage;