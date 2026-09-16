import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyAdminToken, AdminTokenPayload } from "@/lib/auth";

/**
 * API route handler'ları içinde admin oturumunu doğrular.
 * Middleware zaten /admin/* sayfalarını korur, ancak API route'ları
 * middleware matcher'ının dışında olduğu için (bkz. middleware.ts config.matcher)
 * her admin-only endpoint bu fonksiyonu ayrıca çağırmalıdır — "her katmanda doğrula".
 */
export async function requireAdmin(
  request: NextRequest
): Promise<AdminTokenPayload | null> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
