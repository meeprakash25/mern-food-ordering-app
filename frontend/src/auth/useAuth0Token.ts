import { useAuth0 } from "@auth0/auth0-react"
import { useCallback } from "react"

/** Error thrown when we redirect for consent so callers can avoid showing a toast */
export const CONSENT_REDIRECT = "CONSENT_REDIRECT"

/**
 * Returns a function that gets an access token and handles "Consent required"
 * by redirecting to Auth0 with prompt=consent instead of showing an error toast.
 */
export function useAuth0Token() {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0()

  const getToken = useCallback(async (): Promise<string> => {
    try {
      return await getAccessTokenSilently()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      const code = err && typeof err === "object" && "error" in err ? (err as { error?: string }).error : ""
      const needsConsent =
        message.includes("Consent") ||
        message.includes("consent_required") ||
        code === "consent_required" ||
        code === "login_required"
      if (needsConsent) {
        await loginWithRedirect({ authorizationParams: { prompt: "consent" } })
        throw new Error(CONSENT_REDIRECT)
      }
      throw err
    }
  }, [getAccessTokenSilently, loginWithRedirect])

  return getToken
}
