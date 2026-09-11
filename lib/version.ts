/**
 * Versioning scheme for the site and for Rob.
 *
 * major = years since 1999 (the initial release, at Mirago)
 * minor = calendar month
 * patch = always 0. Patches are unreleased.
 */
export const EPOCH_YEAR = 1999;

export function versionFor(year: number, month: number): string {
  return `${year - EPOCH_YEAR}.${month}.0`;
}

export function currentVersion(now = new Date()): string {
  return versionFor(now.getUTCFullYear(), now.getUTCMonth() + 1);
}

export function yearsShipping(now = new Date()): number {
  return now.getUTCFullYear() - EPOCH_YEAR;
}
