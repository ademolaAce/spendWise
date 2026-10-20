
export interface ReportParameterConfig {
  label: string;
  controlName: string;
  type: 'text' | 'number' | 'date' | 'select';
  endpoint?: string;
  required?: boolean;
}

export const REPORT_PARAMETER_MAP: Record<
  string,
  ReportParameterConfig
> = {
  // Office and staff
  OfficeIdSelectOne: {
    label: 'Office',
    controlName: 'officeId',
    type: 'select',
    endpoint: 'offices',
  },

  officeIdSelectAll: {
    label: 'Office',
    controlName: 'officeId',
    type: 'select',
    endpoint: 'offices',
  },

  loanOfficerIdSelectAll: {
    label: 'Loan Officer',
    controlName: 'loanOfficerId',
    type: 'select',
    endpoint: 'staff',
  },

  staffIdSelectOne: {
    label: 'Staff',
    controlName: 'staffId',
    type: 'select',
    endpoint: 'staff',
  },

  // Clients, groups and centers
  clientIdSelectOne: {
    label: 'Client',
    controlName: 'clientId',
    type: 'select',
    endpoint: 'clients',
  },

  clientIdSelectAll: {
    label: 'Client',
    controlName: 'clientId',
    type: 'select',
    endpoint: 'clients',
  },

  groupIdSelectOne: {
    label: 'Group',
    controlName: 'groupId',
    type: 'select',
    endpoint: 'groups',
  },

  groupIdSelectAll: {
    label: 'Group',
    controlName: 'groupId',
    type: 'select',
    endpoint: 'groups',
  },

  centerIdSelectOne: {
    label: 'Center',
    controlName: 'centerId',
    type: 'select',
    endpoint: 'centers',
  },

  // Loan and savings products
  loanProductIdSelectAll: {
    label: 'Loan Product',
    controlName: 'loanProductId',
    type: 'select',
    endpoint: 'loanproducts',
  },

  loanProductIdSelectOne: {
    label: 'Loan Product',
    controlName: 'loanProductId',
    type: 'select',
    endpoint: 'loanproducts',
  },

  savingsProductIdSelectOne: {
    label: 'Savings Product',
    controlName: 'savingsProductId',
    type: 'select',
    endpoint: 'savingsproducts',
  },

  savingsProductIdSelectAll: {
    label: 'Savings Product',
    controlName: 'savingsProductId',
    type: 'select',
    endpoint: 'savingsproducts',
  },

  currencyIdSelectAll: {
    label: 'Currency',
    controlName: 'currencyId',
    type: 'select',
    endpoint: 'currencies',
  },

  fundIdSelectAll: {
    label: 'Fund',
    controlName: 'fundId',
    type: 'select',
    endpoint: 'funds',
  },

  // Custom report dropdowns
  loanPurposeIdSelectAll: {
    label: 'Loan Purpose',
    controlName: 'loanPurposeId',
    type: 'select',
    endpoint:
      'runreports/loanPurposeIdSelectAll?parameterType=true',
  },

  SelectLoanType: {
    label: 'Loan Type',
    controlName: 'loanType',
    type: 'select',
    endpoint:
      'runreports/SelectLoanType?parameterType=true',
  },

  SelectGLAccountNO: {
    label: 'GL Account',
    controlName: 'glAccountNo',
    type: 'select',
    endpoint:
      'runreports/SelectGLAccountNO?parameterType=true',
  },

  parTypeSelect: {
    label: 'PAR Type',
    controlName: 'parType',
    type: 'select',
    endpoint: 'runreports/parTypeSelect?parameterType=true',
  },

  obligDateTypeSelect: {
    label: 'Obligation Date Type',
    controlName: 'obligDateType',
    type: 'select',
    endpoint:
      'runreports/obligDateTypeSelect?parameterType=true',
  },

  // Dates
  startDateSelect: {
    label: 'Start Date',
    controlName: 'startDate',
    type: 'date',
  },

  endDateSelect: {
    label: 'End Date',
    controlName: 'endDate',
    type: 'date',
  },

  fromDate: {
    label: 'From Date',
    controlName: 'fromDate',
    type: 'date',
  },

  toDate: {
    label: 'To Date',
    controlName: 'toDate',
    type: 'date',
  },

  asOnDate: {
    label: 'As On Date',
    controlName: 'asOnDate',
    type: 'date',
  },

  transactionDate: {
    label: 'Transaction Date',
    controlName: 'transactionDate',
    type: 'date',
  },

  submittedOnDate: {
    label: 'Submitted On',
    controlName: 'submittedOnDate',
    type: 'date',
  },

  disbursedOnDate: {
    label: 'Disbursed On',
    controlName: 'disbursedOnDate',
    type: 'date',
  },

  // Account and loan identifiers
  loanId: {
    label: 'Loan ID',
    controlName: 'loanId',
    type: 'number',
  },

  savingsId: {
    label: 'Savings Account ID',
    controlName: 'savingsId',
    type: 'number',
  },

  accountId: {
    label: 'Account ID',
    controlName: 'accountId',
    type: 'number',
  },

  selectAccount: {
    label: 'Account Number',
    controlName: 'selectAccount',
    type: 'text',
  },

  // Other text parameters
  username: {
    label: 'Username',
    controlName: 'username',
    type: 'text',
  },

  externalId: {
    label: 'External ID',
    controlName: 'externalId',
    type: 'text',
  },

  // Branch
  branch: {
    label: 'Branch',
    controlName: 'branch',
    type: 'select',
  },

  // Range and threshold parameters
  fromXSelect: {
    label: 'From X',
    controlName: 'fromXSelect',
    type: 'select',
  },

  overdueXSelect: {
    label: 'Overdue X',
    controlName: 'overdueXSelect',
    type: 'select',
  },

  overdueYSelect: {
    label: 'Overdue Y',
    controlName: 'overdueYSelect',
    type: 'select',
  },

  toYSelect: {
    label: 'To Y',
    controlName: 'toYSelect',
    type: 'select',
  },
};

/**
 * Returns the configuration for a report parameter.
 * Unknown parameters default to a text input.
 */
export const getReportParameterConfig = (
  parameterName: string,
): ReportParameterConfig => {
  return (
    REPORT_PARAMETER_MAP[parameterName] ?? {
      label: parameterName,
      controlName: parameterName,
      type: 'text',
      required: false,
    }
  );
};
