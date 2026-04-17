import { getOffers } from "@/actions/offers";
import PaymentsClient from "./PaymentsClient";
import { OfferKey } from "@/config/offers";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const result = await getOffers();
  const dbOffers = result.error === null ? result.data! : [];

  const sp = await searchParams;
  const initialOfferKeyParams = (sp?.offer_key as string) || "medium";
  const initialOfferKey = initialOfferKeyParams as OfferKey;

  return (
    <PaymentsClient initialOfferKey={initialOfferKey} dbOffers={dbOffers} />
  );
}
