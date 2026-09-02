import { getWixClient, isWixConfigured } from './client';

export type CurrentMember = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  initials: string;
  memberSince: string | null;
};

export async function getCurrentMember(): Promise<CurrentMember | null> {
  if (!isWixConfigured()) return null;
  try {
    const client = await getWixClient();
    const { member } = await client.members.getCurrentMember({ fieldsets: ['FULL'] } as never);
    if (!member) return null;

    const first = member.contact?.firstName ?? '';
    const last = member.contact?.lastName ?? '';
    const email = member.loginEmail ?? member.contact?.emails?.[0] ?? '';
    const fullName = [first, last].filter(Boolean).join(' ') || member.profile?.nickname || email;

    return {
      id: member._id ?? '',
      firstName: first,
      lastName: last,
      fullName,
      email,
      initials: (first[0] ?? email[0] ?? 'S').toUpperCase() + (last[0] ?? '').toUpperCase(),
      memberSince: member._createdDate ? String(member._createdDate) : null,
    };
  } catch {
    // Sessione assente o scaduta: non è un errore da registrare.
    return null;
  }
}
