
import React from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import SafeAreaView from '@/components/SafaAreaView';
import { getallReportById } from '@/service/report';
import { Button } from '@/components/ui/button';

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

const ReportPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [report, setReport] = React.useState<Report | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [parameterValues, setParameterValues] = React.useState<
    Record<string, string>
  >({});

  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const getReportDetails = async () => {
      if (!id) {
        setError('No report ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getallReportById(id);

        if (mounted) {
          const reportData = data?.data ?? data;
          setReport(reportData);
          console.log('Report details:', reportData);
        }
      } catch (err) {
        console.error('Error fetching report details:', err);

        if (mounted) {
          setError('Unable to load report details. Please try again.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getReportDetails();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleParameterChange = (
    parameterId: string,
    value: string,
  ) => {
    setParameterValues((previous) => ({
      ...previous,
      [parameterId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!report) return;

    try {
      setSubmitting(true);

      const payload = {
        reportId: report.id,
        parameters: parameterValues,
      };

    //   async function submitReport() {
    //     response = await fetch(`https://demobox.aheadbanker.com/fineract-provider/api/v1/reports/${report.id}/execute`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(payload),
    //     });

      console.log('Report execution payload:', payload);

      Alert.alert(
        'Parameters ready',
        'Your parameter values have been collected. Connect the report execution API to run the report.',
      );
    } catch (err) {
      console.error('Error submitting report:', err);
      Alert.alert('Error', 'Unable to submit the report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-foreground">
          Loading report details...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-5">
        <Text className="text-center text-foreground">
          {error ?? 'Report details not found.'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-bold text-foreground">
            {report.reportName || 'Unnamed Report'}
          </Text>

          <Text className="mt-2 text-base text-muted-foreground">
            {report.description || 'No description available.'}
          </Text>

          <View className="mt-5 rounded-xl border border-border bg-card p-4">
            <Text className="text-sm text-muted-foreground">
              Report Type
            </Text>
            <Text className="mt-1 text-base font-semibold text-foreground">
              {report.reportType || 'Not specified'}
            </Text>

            <Text className="mt-4 text-sm text-muted-foreground">
              Category
            </Text>
            <Text className="mt-1 text-base font-semibold text-foreground">
              {report.reportCategory || 'Not specified'}
            </Text>

            <Text className="mt-4 text-sm text-muted-foreground">
              Availability
            </Text>
            <Text className="mt-1 text-base font-semibold text-foreground">
              {report.useReport ? 'Available' : 'Unavailable'}
            </Text>
          </View>

          <Text className="mt-6 text-lg font-bold text-foreground">
            Report Parameters
          </Text>

          {report.reportParameters?.length ? (
            <>
              {report.reportParameters.map((parameter) => (
                <View
                  key={parameter.id}
                  className="mt-3 bg-card"
                >
                  <Text className="font-semibold text-foreground">
                    {parameter.parameterName || 'Unnamed Parameter'}
                  </Text>

                  <TextInput
                    value={
                      parameterValues[String(parameter.parameterName)] ?? ''
                    }
                    onChangeText={(value) =>
                      handleParameterChange(
                        String(parameter.parameterName),
                        value,
                      )
                    }
                    placeholder={`Enter ${parameter.parameterName || 'value'}`}
                    placeholderTextColor="#ffffff"
                    autoCapitalize="none"
                    className="mt-3 rounded-lg border border-border px-3 py-3 text-foreground"
                  />
                </View>
              ))}

              <Button
                className="mt-5 bg-amber-700"
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Text className="font-semibold text-primary-foreground">
                  {submitting ? 'Submitting...' : 'Run Report'}
                </Text>
              </Button>
            </>
          ) : (
            <Text className="mt-2 text-sm text-muted-foreground">
              This report has no parameters.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ReportPage;