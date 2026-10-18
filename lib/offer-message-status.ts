export type OfferMessageStatus =
  | "sent"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "expired"
  | "superseded"

export type OfferMessageResponse = Extract<OfferMessageStatus, "accepted" | "rejected">

export const resolveOfferMessageStatus = (
  messageStatus: OfferMessageStatus | undefined,
  localResponse: OfferMessageResponse | null
): OfferMessageStatus => {
  if (messageStatus && messageStatus !== "sent") return messageStatus
  return localResponse ?? "sent"
}
