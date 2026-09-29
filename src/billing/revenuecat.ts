import Purchases from 'react-native-purchases';

export type BillingState = {
  configured: boolean;
  plus: boolean;
  monthlyPrice: string | null;
  message: string;
};

const key = process.env.EXPO_PUBLIC_REVENUECAT_TEST_STORE_API_KEY ?? '';
let configured = false;

export async function loadBilling(): Promise<BillingState> {
  if (!__DEV__) return { configured: false, plus: false, monthlyPrice: null, message: 'Test Store is only enabled in development builds.' };
  if (!key) return { configured: false, plus: false, monthlyPrice: null, message: 'Add the Test Store public SDK key to .env.' };
  try {
    if (!configured) { Purchases.configure({ apiKey: key }); configured = true; }
    const [customer, offerings] = await Promise.all([Purchases.getCustomerInfo(), Purchases.getOfferings()]);
    const monthly = offerings.current?.monthly ?? offerings.current?.availablePackages.find((entry) => entry.identifier === '$rc_monthly');
    return {
      configured: true,
      plus: customer.entitlements.active.coby_plus?.isActive === true,
      monthlyPrice: monthly?.product.priceString ?? null,
      message: monthly ? 'Coby Plus monthly is ready in Test Store.' : 'Create a monthly package in the default RevenueCat offering.',
    };
  } catch {
    return { configured, plus: false, monthlyPrice: null, message: 'RevenueCat could not load. Check the key and Test Store setup.' };
  }
}

export async function purchaseMonthly(): Promise<BillingState> {
  if (!configured) return loadBilling();
  const offerings = await Purchases.getOfferings();
  const monthly = offerings.current?.monthly ?? offerings.current?.availablePackages.find((entry) => entry.identifier === '$rc_monthly');
  if (!monthly) throw new Error('Monthly package unavailable');
  const result = await Purchases.purchasePackage(monthly);
  if (result.customerInfo.entitlements.active.coby_plus?.isActive !== true) throw new Error('Purchase did not unlock Coby Plus');
  return loadBilling();
}

export async function restoreBilling(): Promise<BillingState> {
  if (!configured) return loadBilling();
  const customer = await Purchases.restorePurchases();
  const loaded = await loadBilling();
  return { ...loaded, plus: customer.entitlements.active.coby_plus?.isActive === true };
}
