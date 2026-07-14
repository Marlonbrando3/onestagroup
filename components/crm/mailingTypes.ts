export type MarketingEmailStatus = "unknown" | "consented" | "unsubscribed" | "refused" | "blocked";

export type MailingContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  pipelineId: string | null;
  pipelineName: string;
  ownerEmail: string;
  ownerName: string;
  marketingEmailStatus: MarketingEmailStatus;
  marketingConsentAt: string | null;
  marketingConsentSource: string;
  marketingUnsubscribedAt: string | null;
  marketingConsentEvidenceId: string | null;
  emailDeliverabilityStatus: string;
  consentRequestStatus: "pending" | null;
  consentRequestSentAt: string | null;
  consentRequestExpiresAt: string | null;
};

export type MailingGroup = {
  id: string;
  name: string;
  description: string;
  contactIds: string[];
  memberCount: number;
  consentedCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MailingBlockType = "heading" | "text" | "button" | "image" | "divider";

export type MailingBlock = {
  id: string;
  type: MailingBlockType;
  text?: string;
  url?: string;
  align?: "left" | "center" | "right";
};

export type MailingContent = {
  blocks: MailingBlock[];
};

export type MailingCampaignStatus = "draft" | "scheduled" | "sent" | "failed";

export type MailingCampaign = {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  groupId: string | null;
  content: MailingContent;
  htmlContent: string;
  status: MailingCampaignStatus;
  resendBroadcastId: string | null;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const emptyMailingContent: MailingContent = {
  blocks: [
    { id: "heading-1", type: "heading", text: "Witaj {{{contact.first_name|tam}}}!", align: "left" },
    {
      id: "text-1",
      type: "text",
      text: "Tu wpisz treść wiadomości. Pisz konkretnie i tak, jak w zwykłym mailu do klienta.",
      align: "left",
    },
    { id: "button-1", type: "button", text: "Zobacz ofertę", url: "https://onesta.com.pl", align: "left" },
  ],
};
