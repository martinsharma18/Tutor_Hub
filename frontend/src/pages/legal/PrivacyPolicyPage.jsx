import LegalPageLayout, { LegalSection } from "./LegalPageLayout";

/**
 * TEMPLATE — NOT LEGAL ADVICE. This describes what the platform actually does with data
 * (accurate as of the current codebase), but it has not been reviewed by a lawyer and does not
 * reference Nepal's Individual Privacy Act 2075 or any other specific statute. Have a qualified
 * professional review this before public launch.
 */
const PrivacyPolicyPage = () => (
  <LegalPageLayout title="Privacy Policy" lastUpdated="18 August 2026">
    <p className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
      <strong>Draft notice:</strong> this policy is a working draft and has not yet been reviewed by
      a legal professional. Please review it before relying on it.
    </p>

    <LegalSection heading="1. Who we are">
      <p>
        Best Tuitions ("we", "us") operates a platform connecting parents and students with private
        tutors. This policy explains what personal data we collect, why, and what rights you have.
      </p>
    </LegalSection>

    <LegalSection heading="2. Information we collect">
      <p>Depending on how you use the platform, we collect:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Account details</strong> — name, email address, phone number, password (stored only as a secure hash, never in plain text).</li>
        <li><strong>Teacher profile details</strong> — qualifications, university, graduation year, gender, years of experience, subjects, class levels, bio, hourly rate, and any CV or profile photo you upload.</li>
        <li><strong>Identity information</strong> — where you choose to provide a national ID number for verification purposes.</li>
        <li><strong>Location data</strong> — the city and area you enter, and approximate coordinates used to show nearby matches.</li>
        <li><strong>Platform activity</strong> — tuition requirements you post, applications, demo requests, messages you send through the platform, reviews, and commission/payment records.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="3. How we use your information">
      <ul className="list-disc pl-6 space-y-1">
        <li>To create and operate your account and show your profile to relevant users.</li>
        <li>To match tutors with tuition requirements, including by subject, class level, and distance.</li>
        <li>To enable messaging, demo scheduling, and applications between users.</li>
        <li>To calculate and record platform commission.</li>
        <li>To send you service notifications (for example, when you receive an application or a demo is confirmed).</li>
        <li>To review and approve tutor profiles, and to investigate misuse of the platform.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="4. What other users can see">
      <p>
        Approved tutor profiles — including name, photo, qualifications, subjects, city/area, rating,
        and reviews — are visible publicly, including to people who are not logged in.
      </p>
      <p>
        <strong>Contact details are protected.</strong> A parent's phone number is not shown on public
        listings. It is released to a tutor only after an administrator has verified that the
        applicable commission payment has been made, and only to the specific tutor concerned.
      </p>
    </LegalSection>

    <LegalSection heading="5. Sharing with third parties">
      <p>
        We do not sell your personal data. We share it only with service providers necessary to run
        the platform — our hosting and database provider, and our email delivery provider — and where
        we are required to by law.
      </p>
    </LegalSection>

    <LegalSection heading="6. Data retention">
      <p>
        We keep your account data for as long as your account is active. Records relating to
        completed transactions and commission may be retained longer where needed for accounting
        or dispute-resolution purposes.
      </p>
    </LegalSection>

    <LegalSection heading="7. Your rights">
      <p>
        You can download a copy of everything we hold about you, and delete your account, from
        <strong> Account Settings</strong> once signed in. You may also correct your profile details
        at any time, or contact us using the details on our Contact page.
      </p>
      <p>
        <strong>What deletion actually does:</strong> we permanently erase your name, email address,
        phone number, and profile details, and you will no longer be able to sign in. Records of
        completed payments and commission are retained in anonymized form — no longer linked to
        your identity — because we need them for accounting and dispute resolution. Messages you
        sent remain visible to their recipient, as they are also that person's records.
      </p>
    </LegalSection>

    <LegalSection heading="8. Security">
      <p>
        Passwords are hashed, access to administrative functions is restricted and audit-logged, and
        transport is encrypted. No system is perfectly secure, and we cannot guarantee absolute
        security of information transmitted to us.
      </p>
    </LegalSection>

    <LegalSection heading="9. Children">
      <p>
        Accounts are intended to be created by adults. Where tuition is arranged for a child, the
        account should be held and managed by a parent or guardian.
      </p>
    </LegalSection>

    <LegalSection heading="10. Changes and contact">
      <p>
        We may update this policy from time to time; the date at the top reflects the latest version.
        Questions about this policy can be sent via our Contact page.
      </p>
    </LegalSection>
  </LegalPageLayout>
);

export default PrivacyPolicyPage;
