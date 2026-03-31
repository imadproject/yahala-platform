generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserType {
  CITIZEN
  EMPLOYEE
  ENTITY_MANAGER
  PLATFORM_ADMIN
  SYSTEM_INTEGRATION
}

enum AccountState {
  ACTIVE
  SUSPENDED
  LOCKED
  SOFT_DELETED
}

enum EntityState {
  ACTIVE
  SUSPENDED
  TRANSITIONAL
}

enum ServiceState {
  PUBLISHED
  HIDDEN
  SUSPENDED
  TRANSITIONAL
}

enum RequestState {
  DRAFT
  PENDING_VERIFICATION
  IN_REVIEW
  PENDING_APPROVAL
  PENDING_COMPLETION
  APPROVED
  REJECTED
  CANCELLED
  CLOSED
}

enum RequestOutcome {
  SUCCESS
  REJECTED
  CANCELLED
  REDIRECTED
}

enum TaskStatus {
  PENDING
  ACTIVE
  WAITING_EXTERNAL
  COMPLETED
  REJECTED
  CANCELLED
}

enum AssetState {
  PRE_REGISTERED
  PENDING_APPROVAL
  ACTIVE
  FROZEN
  DISPUTED
  OWNERSHIP_TRANSFERRED
  CANCELLED
}

enum LegalCaseState {
  FILED
  SERVED
  UNDER_REVIEW
  ADJOURNED
  JUDGMENT_ISSUED
  IN_EXECUTION
  EXECUTED
  CLOSED
}

enum NotificationState {
  NEW
  READ
  ACTIONED
  ARCHIVED
}

enum NotificationType {
  INFORMATIONAL
  ACTION_REQUIRED
  LEGAL
  APPOINTMENT_REMINDER
}

enum AppointmentStatus {
  BOOKED
  CONFIRMED
  RESCHEDULED
  MISSED
  COMPLETED
  CANCELLED
}

enum RecordState {
  ACTIVE
  EXPIRED
  CANCELLED
  SUSPENDED
}

enum ApprovalState {
  PENDING
  APPROVED
  REJECTED
  EXPIRED
  CANCELLED
}

enum IntegrationFeedType {
  API
  FILE_IMPORT
  MANUAL_ENTRY
}

enum IntegrationRunStatus {
  RECEIVED
  PROCESSING
  APPLIED
  PARTIAL
  FAILED
}

enum CitizenStatusCategory {
  IDENTITY
  CIVIL
  JUDICIAL
  FINANCIAL
  OWNERSHIP
  SERVICE_ELIGIBILITY
}

model UserAccount {
  id                 String          @id @default(cuid())
  nationalId         String?         @unique
  username           String          @unique
  mobileNumber       String          @unique
  email              String?         @unique
  passwordHash       String
  authStatus         String
  mfaStatus          String
  mfaSecret          String?
  userType           UserType
  accountState       AccountState    @default(ACTIVE)
  linkedEntityId     String?
  defaultRoleCode    String
  lastLoginAt        DateTime?
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
  linkedEntity       GovernmentEntity? @relation(fields: [linkedEntityId], references: [id])
  citizenProfile     CitizenProfile?
  notifications      Notification[]
  auditEvents        AuditEvent[]
  approvalsActed     ApprovalTask[]  @relation("approvalActor")
}

model CitizenProfile {
  id                 String              @id @default(cuid())
  userAccountId      String?             @unique
  nationalId         String              @unique
  firstNameAr        String
  lastNameAr         String
  fullNameAr         String
  birthDate          DateTime?
  gender             String?
  civilStatus        String?
  governorate        String?
  addressText        String?
  phoneNumber        String?
  email              String?
  profileState       String              @default("ACTIVE")
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  userAccount        UserAccount?        @relation(fields: [userAccountId], references: [id])
  requests           ServiceRequest[]
  ownerships         OwnershipRecord[]
  appointments       Appointment[]
  statusEvents       CitizenStatusEvent[]
  legalPartyCases    LegalParty[]
}

model GovernmentEntity {
  id                 String              @id @default(cuid())
  entityCode         String              @unique
  nameAr             String
  nameEn             String?
  entityType         String
  parentEntityId     String?
  jurisdictionScope  String
  serviceCatalogState String
  contactChannels    Json
  dataAuthorityDomains Json
  entityState        EntityState         @default(ACTIVE)
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  parentEntity       GovernmentEntity?   @relation("EntityHierarchy", fields: [parentEntityId], references: [id])
  childEntities      GovernmentEntity[]  @relation("EntityHierarchy")
  users              UserAccount[]
  services           ServiceDefinition[]
  appointments       Appointment[]
  feeds              IntegrationFeed[]
  records            Record[]
  assets             Asset[]
  legalCases         LegalCase[]
}

model ServiceDefinition {
  id                 String              @id @default(cuid())
  serviceCode        String              @unique
  ownerEntityId      String
  serviceName        String
  serviceCategory    String
  serviceDescription String
  targetSubjectType  String
  entryChannel       String
  requiresAppointment Boolean            @default(false)
  requiresPayment    Boolean             @default(false)
  requiresApprovalMatrix Boolean         @default(false)
  dependenciesPolicy Json
  workflowTemplate   Json
  requiredRecords    Json
  requiredAttachments Json
  outputRecordType   String?
  slaProfile         Json
  serviceState       ServiceState        @default(PUBLISHED)
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  ownerEntity        GovernmentEntity    @relation(fields: [ownerEntityId], references: [id])
  requests           ServiceRequest[]
}

model ServiceRequest {
  id                 String              @id @default(cuid())
  requestNumber      String              @unique
  serviceId          String
  citizenId          String
  requesterUserId    String
  targetEntityId     String?
  subjectReference   String?
  submissionChannel  String
  submittedPayloadSnapshot Json
  requestState       RequestState        @default(DRAFT)
  stateReason        String?
  workflowInstance   Json
  priority           String              @default("NORMAL")
  currentStepCode    String?
  requiresActionFrom String?
  decisionOutcome    RequestOutcome?
  outputRecordId     String?
  createdAt          DateTime            @default(now())
  closedAt           DateTime?
  updatedAt          DateTime            @updatedAt
  service            ServiceDefinition   @relation(fields: [serviceId], references: [id])
  citizen            CitizenProfile      @relation(fields: [citizenId], references: [id])
  workflowTasks      WorkflowTask[]
  approvalTasks      ApprovalTask[]
  attachments        Attachment[]
  records            Record[]
  notifications      Notification[]
  appointments       Appointment[]
}

model WorkflowTask {
  id                 String          @id @default(cuid())
  requestId          String
  stepCode           String
  stepName           String
  assignedEntityId   String?
  assignedRoleCode   String?
  assignedUserId     String?
  status             TaskStatus      @default(PENDING)
  dueAt              DateTime?
  startedAt          DateTime?
  completedAt        DateTime?
  decisionNote       String?
  metadata           Json
  request            ServiceRequest  @relation(fields: [requestId], references: [id])
}

model ApprovalTask {
  id                 String          @id @default(cuid())
  requestId          String
  approvalType       String
  targetCitizenId    String?
  targetUserId       String?
  targetEntityId     String?
  state              ApprovalState   @default(PENDING)
  expiresAt          DateTime?
  respondedAt        DateTime?
  responseReason     String?
  actedByUserId      String?
  metadata           Json
  request            ServiceRequest  @relation(fields: [requestId], references: [id])
  actedBy            UserAccount?    @relation("approvalActor", fields: [actedByUserId], references: [id])
}

model Asset {
  id                 String          @id @default(cuid())
  assetNumber        String          @unique
  assetType          String
  issuingEntityId    String
  descriptiveData    Json
  legalStatus        String
  registrationState  String
  currentOwnerRecordId String?
  linkedCaseFlag     Boolean         @default(false)
  assetState         AssetState      @default(PRE_REGISTERED)
  createdViaRequestId String?
  lastVerifiedAt     DateTime?
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
  issuingEntity      GovernmentEntity @relation(fields: [issuingEntityId], references: [id])
  ownerships         OwnershipRecord[]
  attachments        Attachment[]
  records            Record[]
}

model OwnershipRecord {
  id                 String          @id @default(cuid())
  assetId            String
  citizenId          String
  ownershipType      String
  shareNumerator     Int?
  shareDenominator   Int?
  legalBasisRecordId String?
  effectiveFrom      DateTime
  effectiveTo        DateTime?
  isCurrent          Boolean         @default(true)
  createdAt          DateTime        @default(now())
  asset              Asset           @relation(fields: [assetId], references: [id])
  citizen            CitizenProfile  @relation(fields: [citizenId], references: [id])
}

model LegalCase {
  id                 String          @id @default(cuid())
  caseNumber         String          @unique
  caseType           String
  courtEntityId      String
  primaryCitizenId   String?
  filingRequestId    String?
  caseState          LegalCaseState  @default(FILED)
  filingDate         DateTime        @default(now())
  partiesSnapshot    Json
  serviceOfProcessState String
  judgmentState      String
  executionState     String
  linkedAssetIds     Json
  legalEffectsProfile Json
  closedAt           DateTime?
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
  courtEntity        GovernmentEntity @relation(fields: [courtEntityId], references: [id])
  parties            LegalParty[]
  sessions           CaseSession[]
  records            Record[]
  notifications      Notification[]
}

model LegalParty {
  id                 String          @id @default(cuid())
  legalCaseId        String
  citizenId          String
  partyRole          String
  legalCase          LegalCase       @relation(fields: [legalCaseId], references: [id])
  citizen            CitizenProfile  @relation(fields: [citizenId], references: [id])

  @@unique([legalCaseId, citizenId, partyRole])
}

model CaseSession {
  id                 String          @id @default(cuid())
  legalCaseId        String
  sessionNumber      Int
  scheduledAt        DateTime
  locationMode       String
  locationDetails    String?
  minutesText        String?
  decisionSummary    String?
  sessionStatus      String
  legalCase          LegalCase       @relation(fields: [legalCaseId], references: [id])

  @@unique([legalCaseId, sessionNumber])
}

model CitizenStatusEvent {
  id                 String                 @id @default(cuid())
  citizenId          String
  category           CitizenStatusCategory
  code               String
  title              String
  description        String?
  sourceObjectType   String
  sourceObjectId     String
  sourceEntityId     String?
  startsAt           DateTime
  endsAt             DateTime?
  isActive           Boolean                @default(true)
  impactPolicy       Json
  createdAt          DateTime               @default(now())
  citizen            CitizenProfile         @relation(fields: [citizenId], references: [id])
}

model Notification {
  id                 String             @id @default(cuid())
  recipientUserId    String
  recipientType      String
  notificationType   NotificationType
  sourceObjectType   String
  sourceObjectId     String
  messageTitle       String
  messageBody        String
  deliveryChannel    String
  notificationState  NotificationState  @default(NEW)
  actionRequiredFlag Boolean            @default(false)
  actionDeadline     DateTime?
  requestId          String?
  caseId             String?
  createdAt          DateTime           @default(now())
  recipient          UserAccount        @relation(fields: [recipientUserId], references: [id])
  request            ServiceRequest?    @relation(fields: [requestId], references: [id])
  legalCase          LegalCase?         @relation(fields: [caseId], references: [id])
}

model Appointment {
  id                 String              @id @default(cuid())
  appointmentType    String
  relatedObjectType  String
  relatedObjectId    String
  hostEntityId       String
  citizenId          String
  startsAt           DateTime
  endsAt             DateTime
  locationMode       String
  locationDetails    String?
  status             AppointmentStatus   @default(BOOKED)
  attendanceResult   String?
  rescheduleReason   String?
  requestId          String?
  createdAt          DateTime            @default(now())
  hostEntity         GovernmentEntity    @relation(fields: [hostEntityId], references: [id])
  citizen            CitizenProfile      @relation(fields: [citizenId], references: [id])
  request            ServiceRequest?     @relation(fields: [requestId], references: [id])
}

model Record {
  id                 String          @id @default(cuid())
  recordType         String
  recordNumber       String          @unique
  issuingEntityId    String
  subjectType        String
  subjectId          String
  sourceRequestId    String?
  sourceCaseId       String?
  sourceAssetId      String?
  recordState        RecordState     @default(ACTIVE)
  effectiveFrom      DateTime
  effectiveTo        DateTime?
  verificationRef    String
  printableViewRef   String?
  deliveryState      String
  createdAt          DateTime        @default(now())
  issuingEntity      GovernmentEntity @relation(fields: [issuingEntityId], references: [id])
  sourceRequest      ServiceRequest? @relation(fields: [sourceRequestId], references: [id])
  legalCase          LegalCase?      @relation(fields: [sourceCaseId], references: [id])
  asset              Asset?          @relation(fields: [sourceAssetId], references: [id])
}

model Attachment {
  id                 String          @id @default(cuid())
  fileName           String
  mimeType           String
  fileSizeBytes      Int
  storageKey         String          @unique
  checksum           String
  attachedToType     String
  requestId          String?
  assetId            String?
  uploadedByUserId   String
  createdAt          DateTime        @default(now())
  request            ServiceRequest? @relation(fields: [requestId], references: [id])
  asset              Asset?          @relation(fields: [assetId], references: [id])
}

model IntegrationFeed {
  id                 String                 @id @default(cuid())
  sourceEntityId     String
  feedName           String
  feedType           IntegrationFeedType
  version            String
  sourceOfTruthDomain String
  trustLevel         Int
  lastRunAt          DateTime?
  runStatus          IntegrationRunStatus?
  createdAt          DateTime               @default(now())
  sourceEntity       GovernmentEntity       @relation(fields: [sourceEntityId], references: [id])
}

model AuditEvent {
  id                 String          @id @default(cuid())
  actorUserId        String?
  actionCode         String
  objectType         String
  objectId           String
  objectSnapshot     Json
  metadata           Json
  ipAddress          String?
  createdAt          DateTime        @default(now())
  actor              UserAccount?    @relation(fields: [actorUserId], references: [id])

  @@index([objectType, objectId])
}
