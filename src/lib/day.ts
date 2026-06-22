// "YYYY-MM-DD" for the given timezone (defaults to the user's local TZ in VN),
// so "today" on the admin page matches the user's calendar day. en-CA locale
// formats as YYYY-MM-DD.
export function todayKey(tz = "Asia/Ho_Chi_Minh"): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
}
