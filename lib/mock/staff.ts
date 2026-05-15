/**
 * Weloan365 staff members who can hand out a 5-digit referral code to
 * customers during sign-up. Each customer that signs up with a staff code
 * gets that person assigned as their personal advisor.
 */
export interface Staff {
  code: string;          // 5-digit referral code
  name: string;
  role: string;          // e.g. "Credit Officer", "Senior Credit Officer", "Branch Manager"
  roleShort: string;     // e.g. "CO", "Sr. CO", "BM"
  branchName: string;
  branchId: string;
  yearsOfService: number;
  /** Two-letter initials for the avatar. */
  initials: string;
  /** Avatar background color (single solid color or gradient). */
  color: string;
}

export const staff: Staff[] = [
  {
    code: "12345",
    name: "Lina Sok",
    role: "Credit Officer",
    roleShort: "CO",
    branchName: "Weloan365 HQ — Phnom Penh",
    branchId: "b1",
    yearsOfService: 4,
    initials: "LS",
    color: "#1f5fff",
  },
  {
    code: "67890",
    name: "Dara Pich",
    role: "Credit Officer",
    roleShort: "CO",
    branchName: "Siem Reap Branch",
    branchId: "b2",
    yearsOfService: 2,
    initials: "DP",
    color: "#00c48c",
  },
  {
    code: "24680",
    name: "Sopheap Chan",
    role: "Senior Credit Officer",
    roleShort: "Sr. CO",
    branchName: "Weloan365 HQ — Phnom Penh",
    branchId: "b1",
    yearsOfService: 7,
    initials: "SC",
    color: "#ff9f1c",
  },
  {
    code: "13579",
    name: "Bopha Nim",
    role: "Branch Manager",
    roleShort: "BM",
    branchName: "Battambang Branch",
    branchId: "b3",
    yearsOfService: 9,
    initials: "BN",
    color: "#c2185b",
  },
];

export function getStaffByCode(code: string): Staff | undefined {
  return staff.find((s) => s.code === code);
}
