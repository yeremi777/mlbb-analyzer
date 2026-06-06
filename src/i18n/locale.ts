"use server";

import { cookies } from "next/headers";

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";

export async function getUserLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;

  return isLocale(value) ? value : defaultLocale;
}

export async function setUserLocale(locale: Locale): Promise<void> {
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    // Secure in production (HTTPS); left off in dev so it works on http://localhost.
    secure: process.env.NODE_ENV === "production",
  });
}
