import { unstable_cache } from 'next/cache';
import { getPublicWixClient, isWixConfigured } from './client';

export type MembershipPlan = {
  id: string;
  name: string;
  description: string;
  slug: string;
  amount: number;
  currency: string;
  period: 'MONTH' | 'YEAR' | 'ONE_TIME';
  /** Vero quando la quota è trattenuta alla fonte e non incassata dal sito. */
  withheld: boolean;
  perks: string[];
};

const PERIOD_LABEL: Record<MembershipPlan['period'], string> = {
  MONTH: 'al mese',
  YEAR: "all'anno",
  ONE_TIME: 'una tantum',
};

export function periodLabel(plan: MembershipPlan): string {
  return PERIOD_LABEL[plan.period];
}

export function formatAmount(plan: MembershipPlan): string {
  if (plan.amount === 0) return 'Trattenuta';
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: plan.currency || 'EUR',
    maximumFractionDigits: plan.amount % 1 === 0 ? 0 : 2,
  }).format(plan.amount);
}

async function fetchPlans(): Promise<MembershipPlan[]> {
  if (!isWixConfigured()) return [];
  try {
    const client = getPublicWixClient();
    const res = await client.plansV3.queryPlans().limit(50).find();
    const plans = (res.items ?? []) as Array<Record<string, any>>;

    return plans
      // I piani archiviati o privati non devono più comparire in pagina:
      // oggi il sito Wix ne pubblica due residui dei test ("Plan 0", "plna").
      .filter((p) => !p.archived && p.visibility === 'PUBLIC')
      .map((plan) => {
        const variant = plan.pricingVariants?.[0] ?? {};
        const amount = Number(variant.pricingStrategies?.[0]?.flatRate?.amount ?? 0);
        const cycle = variant.billingTerms?.billingCycle?.period as string | undefined;
        return {
          id: plan._id ?? plan.id ?? '',
          name: (plan.name ?? '').trim(),
          description: (plan.description ?? '').trim(),
          slug: plan.slug ?? '',
          amount,
          currency: variant.pricingStrategies?.[0]?.flatRate?.currency ?? 'EUR',
          period: (cycle === 'YEAR' ? 'YEAR' : cycle === 'MONTH' ? 'MONTH' : 'ONE_TIME') as MembershipPlan['period'],
          withheld: amount === 0,
          perks: (plan.perks?.values ?? plan.perks ?? []) as string[],
        };
      })
      .sort((a, b) => b.amount - a.amount);
  } catch (error) {
    console.error('[snami] lettura piani non riuscita:', error);
    return [];
  }
}

/** Le quote cambiano di rado: un'ora di cache è abbondante. */
export const getPlans = unstable_cache(fetchPlans, ['snami-piani'], {
  revalidate: 3600,
  tags: ['piani'],
});
