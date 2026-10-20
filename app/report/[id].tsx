// import React from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Keyboard,
//   Platform,
//   Pressable,
//   ScrollView,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from '@react-native-community/datetimepicker';
// import { router, useLocalSearchParams } from 'expo-router';
// import * as SecureStore from 'expo-secure-store';

// import SafeAreaView from '@/components/SafaAreaView';
// import { Button } from '@/components/ui/button';
// import {
//   getReportParameterConfig,
//   type ReportParameterConfig,
// } from '@/app/constant/report-parameters';
// import { getallReportById, runReport } from '@/service/report';

// type ReportParameter = {
//   id: number;
//   parameterId: number;
//   parameterName: string;
// };

// type Report = {
//   id: string | number;
//   reportName: string;
//   reportType: string;
//   reportCategory: string;
//   description: string;
//   coreReport: boolean;
//   useReport: boolean;
//   reportParameters: ReportParameter[];
// };

// type SelectOption = {
//   label: string;
//   value: string;
// };

// const API_BASE =
//   'https://demobox.aheadbanker.com/fineract-provider/api/v1';

// const formatDate = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');

//   return `${year}-${month}-${day}`;
// };

// const getErrorMessage = (error: unknown): string => {
//   if (error instanceof Error) {
//     return error.message;
//   }

//   return 'An unexpected error occurred. Please try again.';
// };

// const normalizeParameterName = (name: string): string =>
//   name.replace(/^R_/i, '');

// const getParameterKey = (parameter: ReportParameter): string =>
//   `${parameter.id}:${normalizeParameterName(parameter.parameterName)}`;

// const getParameterConfig = (
//   parameterName: string,
// ): ReportParameterConfig =>
//   getReportParameterConfig(normalizeParameterName(parameterName));

// const extractOptions = (data: unknown): SelectOption[] => {
//   const response = data as any;

//   const list = Array.isArray(response)
//     ? response
//     : Array.isArray(response?.data)
//       ? response.data
//       : Array.isArray(response?.pageItems)
//         ? response.pageItems
//         : Array.isArray(response?.options)
//           ? response.options
//           : Array.isArray(response?.results)
//             ? response.results
//             : [];

//   return list
//     .map((item: any): SelectOption | null => {
//       if (typeof item === 'string' || typeof item === 'number') {
//         return {
//           label: String(item),
//           value: String(item),
//         };
//       }

//       if (!item || typeof item !== 'object') {
//         return null;
//       }

//       const value =
//         item.id ??
//         item.value ??
//         item.code ??
//         item.officeId ??
//         item.staffId ??
//         item.clientId ??
//         item.productId ??
//         item.currencyCode;

//       const label =
//         item.name ??
//         item.label ??
//         item.displayName ??
//         item.officeName ??
//         item.staffName ??
//         item.clientName ??
//         item.productName ??
//         item.currencyName ??
//         item.currencyCode ??
//         value;

//       if (value === undefined || value === null) {
//         return null;
//       }

//       return {
//         label: String(label),
//         value: String(value),
//       };
//     })
//     .filter((item): item is SelectOption => item !== null);
// };

// const ReportPageID = () => {
//   const { id } = useLocalSearchParams<{
//     id: string | string[];
//   }>();

//   const reportId = Array.isArray(id) ? id[0] : id;

//   const [report, setReport] = React.useState<Report | null>(null);
//   const [loading, setLoading] = React.useState(true);
//   const [submitting, setSubmitting] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   // Values and errors are keyed by unique parameter identity.
//   const [parameterValues, setParameterValues] = React.useState<
//     Record<string, string>
//   >({});
//   const [fieldErrors, setFieldErrors] = React.useState<
//     Record<string, string>
//   >({});

//   const [optionsByField, setOptionsByField] = React.useState<
//     Record<string, SelectOption[]>
//   >({});
//   const [optionsLoading, setOptionsLoading] = React.useState<
//     Record<string, boolean>
//   >({});
//   const [optionsErrors, setOptionsErrors] = React.useState<
//     Record<string, string>
//   >({});

//   const [openSelect, setOpenSelect] = React.useState<string | null>(null);
//   const [openDate, setOpenDate] = React.useState<string | null>(null);

//   const optionsRequests = React.useRef<
//     Record<string, Promise<void> | undefined>
//   >({});
//   const mountedRef = React.useRef(false);

//   const fetchReportDetails = React.useCallback(async () => {
//     if (!reportId) {
//       setReport(null);
//       setError('No report ID was provided.');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await getallReportById(String(reportId));
//       const data = response?.data ?? response;

//       if (!data || typeof data !== 'object') {
//         throw new Error(
//           'Invalid report details returned by the server.',
//         );
//       }

//       setReport(data as Report);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [reportId]);

//   React.useEffect(() => {
//     mountedRef.current = true;
//     void fetchReportDetails();

//     return () => {
//       mountedRef.current = false;
//       optionsRequests.current = {};
//     };
//   }, [fetchReportDetails]);

//   const updateValue = React.useCallback(
//     (key: string, value: string) => {
//       setParameterValues((previous) => ({
//         ...previous,
//         [key]: value,
//       }));

//       setFieldErrors((previous) => {
//         const next = { ...previous };
//         delete next[key];
//         return next;
//       });
//     },
//     [],
//   );

//   const loadOptions = React.useCallback(
//     async (
//       fieldKey: string,
//       endpoint: string | undefined,
//       forceRetry = false,
//     ): Promise<void> => {
//       if (!endpoint?.trim()) {
//         setOptionsErrors((previous) => ({
//           ...previous,
//           [fieldKey]:
//             'No options endpoint is configured for this parameter.',
//         }));
//         return;
//       }

//       const existingRequest = optionsRequests.current[fieldKey];

//       if (existingRequest) {
//         return existingRequest;
//       }

//       if (
//         !forceRetry &&
//         optionsByField[fieldKey] !== undefined
//       ) {
//         return;
//       }

//       const request = (async () => {
//         setOptionsLoading((previous) => ({
//           ...previous,
//           [fieldKey]: true,
//         }));

//         setOptionsErrors((previous) => {
//           const next = { ...previous };
//           delete next[fieldKey];
//           return next;
//         });

//         try {
//           const authKey =
//             await SecureStore.getItemAsync('auth_key');

//           if (!authKey) {
//             throw new Error(
//               'Authentication key not found. Please sign in again.',
//             );
//           }

//           const cleanEndpoint = endpoint.trim().replace(/^\/+/, '');
//           const url = `${API_BASE}/${cleanEndpoint}`;

//           const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//               Accept: 'application/json',
//               Authorization: `Basic ${authKey}`,
//               'Fineract-Platform-TenantId': 'default',
//             },
//           });

//           if (!response.ok) {
//             const body = await response.text();

//             throw new Error(
//               body ||
//                 `Could not load options (${response.status}).`,
//             );
//           }

//           const data: unknown = await response.json();
//           const options = extractOptions(data);

//           if (!mountedRef.current) {
//             return;
//           }

//           setOptionsByField((previous) => ({
//             ...previous,
//             [fieldKey]: options,
//           }));

//           if (options.length === 0) {
//             setOptionsErrors((previous) => ({
//               ...previous,
//               [fieldKey]:
//                 'No options were returned. Check the endpoint and response format.',
//             }));
//           }
//         } catch (err) {
//           if (mountedRef.current) {
//             setOptionsErrors((previous) => ({
//               ...previous,
//               [fieldKey]: getErrorMessage(err),
//             }));
//           }
//         } finally {
//           delete optionsRequests.current[fieldKey];

//           if (mountedRef.current) {
//             setOptionsLoading((previous) => ({
//               ...previous,
//               [fieldKey]: false,
//             }));
//           }
//         }
//       })();

//       optionsRequests.current[fieldKey] = request;
//       return request;
//     },
//     [optionsByField],
//   );

//   const handleDateChange = (
//     key: string,
//     event: DateTimePickerEvent,
//     selectedDate?: Date,
//   ) => {
//     if (event.type === 'dismissed') {
//       setOpenDate(null);
//       return;
//     }

//     if (event.type === 'set' && selectedDate) {
//       updateValue(key, formatDate(selectedDate));

//       if (Platform.OS !== 'ios') {
//         setOpenDate(null);
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     if (!report || submitting) {
//       return;
//     }

//     if (!report.useReport) {
//       Alert.alert(
//         'Report unavailable',
//         'This report cannot currently be run.',
//       );
//       return;
//     }

//     const nextErrors: Record<string, string> = {};
//     const requestParameters: Record<string, string> = {};

//     for (const parameter of report.reportParameters ?? []) {
//       const config = getParameterConfig(parameter.parameterName);
//       const fieldKey = getParameterKey(parameter);
//       const value = (parameterValues[fieldKey] ?? '').trim();

//       if (config.required && !value) {
//         nextErrors[fieldKey] = `${config.label} is required.`;
//         continue;
//       }

//       if (!value) {
//         continue;
//       }

//       if (
//         config.type === 'number' &&
//         !Number.isFinite(Number(value))
//       ) {
//         nextErrors[fieldKey] =
//           `${config.label} must be a valid number.`;
//         continue;
//       }

//       // The backend expects the configured controlName.
//       // UI state remains keyed by unique parameter identity.
//       requestParameters[config.controlName] = value;
//     }

//     setFieldErrors(nextErrors);

//     if (Object.keys(nextErrors).length > 0) {
//       Alert.alert(
//         'Check report parameters',
//         'Please correct the highlighted fields before running the report.',
//       );
//       return;
//     }

//     Keyboard.dismiss();
//     setSubmitting(true);
//     setOpenSelect(null);
//     setOpenDate(null);

//     try {
//       await runReport(report.reportName, requestParameters);

//       // Keep the existing result route. The result screen should
//       // retrieve the report output using your report service/store.
//       router.push('/report-result');
//     } catch (err) {
//       Alert.alert(
//         'Report execution failed',
//         getErrorMessage(err),
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1 items-center justify-center bg-background">
//         <ActivityIndicator size="large" />
//         <Text className="mt-3 text-foreground">
//           Loading report details...
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   if (error || !report) {
//     return (
//       <SafeAreaView className="flex-1 items-center justify-center bg-background px-5">
//         <Text className="text-center text-foreground">
//           {error ?? 'Report not found.'}
//         </Text>

//         <Button
//           className="mt-5"
//           onPress={() => void fetchReportDetails()}
//         >
//           <Text className="font-semibold text-primary-foreground">
//             Try Again
//           </Text>
//         </Button>

//         <Pressable
//           className="mt-4 p-2"
//           onPress={() => router.back()}
//         >
//           <Text className="text-primary">Back to reports</Text>
//         </Pressable>
//       </SafeAreaView>
//     );
//   }

//   const reportParameters = report.reportParameters ?? [];

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       <ScrollView
//         className="flex-1"
//         contentContainerStyle={{
//           paddingHorizontal: 20,
//           paddingTop: 20,
//           paddingBottom: 36,
//         }}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <Text className="text-2xl font-bold text-foreground">
//           {report.reportName || 'Unnamed Report'}
//         </Text>

//         <Text className="mt-2 text-base text-muted-foreground">
//           {report.description || 'No description available.'}
//         </Text>

//         <View className="mt-5 rounded-xl border border-border bg-card p-4">
//           <Text className="text-sm text-muted-foreground">
//             Report Type
//           </Text>
//           <Text className="mt-1 font-semibold text-foreground">
//             {report.reportType || 'Not specified'}
//           </Text>

//           <Text className="mt-4 text-sm text-muted-foreground">
//             Category
//           </Text>
//           <Text className="mt-1 font-semibold text-foreground">
//             {report.reportCategory || 'Not specified'}
//           </Text>

//           <Text className="mt-4 text-sm text-muted-foreground">
//             Availability
//           </Text>
//           <Text className="mt-1 font-semibold text-foreground">
//             {report.useReport ? 'Available' : 'Unavailable'}
//           </Text>
//         </View>

//         <Text className="mt-6 text-lg font-bold text-foreground">
//           Report Parameters
//         </Text>

//         {reportParameters.length === 0 ? (
//           <View className="mt-4 rounded-lg border border-border bg-card p-4">
//             <Text className="text-muted-foreground">
//               This report has no parameters.
//             </Text>
//           </View>
//         ) : null}

//         {reportParameters.map((parameter) => {
//           const parameterName = parameter.parameterName;
//           const config = getParameterConfig(parameterName);
//           const fieldKey = getParameterKey(parameter);
//           const value = parameterValues[fieldKey] ?? '';

//           const hasSelectEndpoint =
//             config.type === 'select' && !!config.endpoint?.trim();

//           const isDate = config.type === 'date';
//           const isSelectOpen = openSelect === fieldKey;
//           const options = optionsByField[fieldKey] ?? [];
//           const isOptionsLoading = !!optionsLoading[fieldKey];
//           const optionsError = optionsErrors[fieldKey];

//           const selectedOption = options.find(
//             (option) => option.value === value,
//           );

//           return (
//             <View key={fieldKey} className="mt-4">
//               <Text className="mb-2 font-semibold text-foreground">
//                 {config.label}
//                 {config.required ? ' *' : ''}
//               </Text>

//               {hasSelectEndpoint ? (
//                 <>
//                   <Pressable
//                     disabled={submitting}
//                     accessibilityRole="button"
//                     accessibilityState={{
//                       expanded: isSelectOpen,
//                     }}
//                     onPress={() => {
//                       const willOpen = !isSelectOpen;

//                       setOpenSelect(
//                         willOpen ? fieldKey : null,
//                       );

//                       if (willOpen) {
//                         void loadOptions(
//                           fieldKey,
//                           config.endpoint,
//                         );
//                       }
//                     }}
//                     className="rounded-lg border border-border bg-card px-3 py-3"
//                   >
//                     <Text
//                       className={
//                         value
//                           ? 'text-foreground'
//                           : 'text-muted-foreground'
//                       }
//                     >
//                       {selectedOption?.label ??
//                         (isOptionsLoading
//                           ? 'Loading options...'
//                           : value || 'Select an option')}
//                     </Text>
//                   </Pressable>

//                   {isSelectOpen ? (
//                     <View className="mt-2 rounded-lg border border-border bg-card">
//                       {isOptionsLoading ? (
//                         <View className="p-4">
//                           <ActivityIndicator />
//                           <Text className="mt-2 text-center text-sm text-muted-foreground">
//                             Loading options...
//                           </Text>
//                         </View>
//                       ) : options.length > 0 ? (
//                         <ScrollView
//                           nestedScrollEnabled
//                           style={{ maxHeight: 220 }}
//                         >
//                           {options.map((option, index) => (
//                             <Pressable
//                               key={`${option.value}-${index}`}
//                               accessibilityRole="button"
//                               onPress={() => {
//                                 updateValue(fieldKey, option.value);
//                                 setOpenSelect(null);
//                               }}
//                               className="border-b border-border px-3 py-3"
//                             >
//                               <Text className="text-foreground">
//                                 {option.label}
//                               </Text>
//                             </Pressable>
//                           ))}
//                         </ScrollView>
//                       ) : (
//                         <Text className="p-3 text-sm text-muted-foreground">
//                           {optionsError ?? 'No options available.'}
//                         </Text>
//                       )}

//                       {optionsError ? (
//                         <Pressable
//                           disabled={isOptionsLoading}
//                           onPress={() => {
//                             void loadOptions(
//                               fieldKey,
//                               config.endpoint,
//                               true,
//                             );
//                           }}
//                           className="p-3"
//                         >
//                           <Text className="font-semibold text-primary">
//                             Retry loading options
//                           </Text>
//                         </Pressable>
//                       ) : null}
//                     </View>
//                   ) : null}
//                 </>
//               ) : isDate ? (
//                 <>
//                   <Pressable
//                     disabled={submitting}
//                     accessibilityRole="button"
//                     onPress={() => setOpenDate(fieldKey)}
//                     className="rounded-lg border border-border bg-card px-3 py-3"
//                   >
//                     <Text
//                       className={
//                         value
//                           ? 'text-foreground'
//                           : 'text-muted-foreground'
//                       }
//                     >
//                       {value || 'Choose date'}
//                     </Text>
//                   </Pressable>

//                   {openDate === fieldKey ? (
//                     <>
//                       <DateTimePicker
//                         value={
//                           /^\d{4}-\d{2}-\d{2}$/.test(value)
//                             ? new Date(`${value}T12:00:00`)
//                             : new Date()
//                         }
//                         mode="date"
//                         display={
//                           Platform.OS === 'ios'
//                             ? 'spinner'
//                             : 'default'
//                         }
//                         onChange={(event, selectedDate) =>
//                           handleDateChange(
//                             fieldKey,
//                             event,
//                             selectedDate,
//                           )
//                         }
//                       />

//                       {Platform.OS === 'ios' ? (
//                         <Pressable
//                           className="mt-2 self-end p-2"
//                           onPress={() => setOpenDate(null)}
//                         >
//                           <Text className="font-semibold text-primary">
//                             Done
//                           </Text>
//                         </Pressable>
//                       ) : null}
//                     </>
//                   ) : null}
//                 </>
//               ) : (
//                 <TextInput
//                   value={value}
//                   onChangeText={(text) =>
//                     updateValue(fieldKey, text)
//                   }
//                   placeholder={`Enter ${config.label}`}
//                   placeholderTextColor="#9CA3AF"
//                   keyboardType={
//                     config.type === 'number'
//                       ? 'numeric'
//                       : 'default'
//                   }
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   editable={!submitting}
//                   className="rounded-lg border border-border bg-card px-3 py-3 text-foreground"
//                 />
//               )}

//               {fieldErrors[fieldKey] ? (
//                 <Text className="mt-1 text-sm text-red-500">
//                   {fieldErrors[fieldKey]}
//                 </Text>
//               ) : null}
//             </View>
//           );
//         })}

//         <Button
//           className="mt-6 bg-amber-700"
//           onPress={() => void handleSubmit()}
//           disabled={submitting || !report.useReport}
//         >
//           {submitting ? (
//             <View className="flex-row items-center">
//               <ActivityIndicator color="#FFFFFF" size="small" />
//               <Text className="ml-2 font-semibold text-white">
//                 Running report...
//               </Text>
//             </View>
//           ) : (
//             <Text className="font-semibold text-white">
//               Run Report
//             </Text>
//           )}
//         </Button>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default ReportPageID;

import { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { getallReportById } from '@/service/report';
import React from 'react';
import SafaAreaView from '@/components/SafaAreaView';

export default function ReportDetails() {
  const { id } = useLocalSearchParams<{
    id: string | string[];
  }>();

  const reportId = Array.isArray(id) ? id[0] : id;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reportId) {
      setLoading(false);
      return;
    }

    getallReportById(reportId)
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reportId]);
console.log('repss', report, reportId)
  if (loading) {
    return <ActivityIndicator />;
  }

  if (!report) {
    return <Text>Report not found.</Text>;
  }

  return (
    <SafaAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

    <View className="flex-row items-center gap-4">

      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950">
        <Ionicons name="document-text-outline" size={32} color="#6366f1" />
      </View>

      <View className="flex-1">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Report Details
        </Text>

        <Text className="mt-1 text-2xl font-bold text-foreground">
          {report.reportName || 'Unnamed Report'}
        </Text>
      </View>
    </View>

    <View className="mt-8">
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Report Information
      </Text>

      <View className="rounded-2xl border border-border bg-card p-4">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
            <Ionicons name="layers-outline" size={22} color="#6366f1" />
          </View>

          <View className="flex-1">
            <Text className="text-sm text-muted-foreground">
              Report Type
            </Text>
            <Text className="mt-1 font-semibold text-foreground">
              {report.reportType || 'Not specified'}
            </Text>
          </View>
        </View>

        <View className="my-2 h-px bg-border" />
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
            <Ionicons
              name="folder-open-outline"
              size={22}
              color="#6366f1"
            />
          </View>

          <View className="flex-1">
            <Text className="text-sm text-muted-foreground">
              Category
            </Text>
            <Text className="mt-1 font-semibold text-foreground">
              {report.reportCategory || 'Not specified'}
            </Text>
          </View>
        </View>

        <View className="my-2 h-px bg-border" />

        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950">
            <Ionicons
              name={
                report.useReport
                  ? 'checkmark-circle-outline'
                  : 'close-circle-outline'
              }
              size={22}
              color={report.useReport ? '#16a34a' : '#dc2626'}
            />
          </View>

          <View className="flex-1">
            <Text className="text-sm text-muted-foreground">
              Availability
            </Text>
            <Text className="mt-1 font-semibold text-foreground">
              {report.useReport ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
      </View>
    </View>

    <View className='mt-8'>
      <Text className="mb-4 text-lg font-semibold text-foreground">
        Report Parameters
      </Text>
      {/* <View>
        {report.reportParameters}
      </View> */}
    </View>
  </ScrollView>
</SafaAreaView>

  );
}

