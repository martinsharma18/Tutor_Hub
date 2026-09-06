import LegalPageLayout, { LegalSection } from "./LegalPageLayout";

/**
 * TEMPLATE — NOT LEGAL ADVICE. Deliberately narrow: the platform currently uses browser
 * localStorage for the auth session and sets no advertising or analytics cookies. If analytics
 * or third-party tracking is added later, this page must be expanded to match.
 */
const CookiePolicyPage = () => (
  <LegalPageLayout title="Cookie Policy" lastUpdated="18 August 2026">
    <p className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
      <strong>Draft notice:</strong> this policy is a working draft and has not yet been reviewed by
      a legal professional.
    </p>

    <LegalSection heading="1. What we store on your device">
      <p>
        Best Tuitions keeps your login session in your browser's local storage. This holds your
        access token, refresh token, and basic account details (name, email, role) so you stay
        signed in between visits and page reloads.
      </p>
      <p>
        This is strictly necessary for the platform to work — without it you would be signed out on
        every page navigation.
      </p>
    </LegalSection>

    <LegalSection heading="2. What we do not use">
      <p>
        We do not currently set advertising cookies, and we do not use third-party tracking or
        analytics cookies to build a profile of your browsing across other websites.
      </p>
    </LegalSection>

    <LegalSection heading="3. Managing it">
      <p>
        Signing out clears the stored session. You can also clear site data through your browser
        settings at any time — doing so will sign you out.
      </p>
    </LegalSection>

    <LegalSection heading="4. Changes">
      <p>
        If we introduce analytics or other non-essential storage in future, we will update this page
        and, where required, ask for your consent first.
      </p>
    </LegalSection>
  </LegalPageLayout>
);

export default CookiePolicyPage;
