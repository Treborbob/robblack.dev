/**
 * Calendar versioning, YY.MM.x, for the site and for Rob.
 *
 * 26.01.0 is January 2026. 00.10.0 is October 2000. Patch is always 0.
 */
export const EPOCH_YEAR = 1999;

export function versionFor(year: number, month: number): string {
  const yy = String(year).slice(-2);
  const mm = String(month).padStart(2, "0");
  return `${yy}.${mm}.0`;
}

export function currentVersion(now = new Date()): string {
  return versionFor(now.getUTCFullYear(), now.getUTCMonth() + 1);
}

export function yearsShipping(now = new Date()): number {
  return now.getUTCFullYear() - EPOCH_YEAR;
}
