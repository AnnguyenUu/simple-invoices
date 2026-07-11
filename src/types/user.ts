export type CustomField = {
  customFieldId: string;
  customKey: string;
  customValue: string;
};

export type Membership = {
  membershipId: string;
  organisationId: string;
  organisationName: string;
  roleName: string;
  token: string;
  organisationNumber: string;
  companyNumber: string;
  organisationRole: string;
};

export type KycDetails = {
  documents: unknown[];
};

export type AmlDetails = {
  accountId: string;
  sourceOfFundsRiskScore: number;
  expectedMonthlyTransactionsScore: number;
  nationalityRiskScore: number;
  riskScore: number;
  amlRiskScore: number;
  aggregateRiskScore: number;
  isPepOrRca: boolean;
  isSanction: boolean;
  isPersonOfHighInterest: boolean;
  isHighNetWorth: boolean;
};

export type UserApp = {
  appName: string;
  onboardingAt: string;
};

export type CreditDetail = {
  accountId: string;
  creditType: string;
  annualIncome: number;
};

export type UserRole = {
  roleId: string;
  roleName: string;
  permissions: unknown[];
  type: string;
  entityId: string;
};

export type User = {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  nickName: string;
  fullName: string;
  mobileNumber: string;
  isUSCitizen: boolean;
  status: string;
  isDeleted: boolean;
  lastLoginAt: string;
  contacts: unknown[];
  addresses: unknown[];
  listCustomFields: CustomField[];
  employmentDetails: unknown[];
  taxDetails: unknown[];
  memberships: Membership[];
  orgRelationships: unknown[];
  kycDetails: KycDetails;
  amlDetails: AmlDetails;
  apps: UserApp[];
  listRoles: string[];
  permissions: unknown[];
  segments: unknown[];
  creditDetails: CreditDetail[];
  createdAt: string;
  passwordExpired: boolean;
  updatedAt: string;
  cif: string;
  devices: unknown[];
  roles: UserRole[];
};

export type UserResponse = {
  data: User;
};
