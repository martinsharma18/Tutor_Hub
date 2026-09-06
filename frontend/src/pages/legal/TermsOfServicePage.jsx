import LegalPageLayout, { LegalSection } from "./LegalPageLayout";

/**
 * TEMPLATE — NOT LEGAL ADVICE. Reflects how the platform actually behaves today (commission
 * model, contact unlocking, approval workflow) but has not been reviewed by a lawyer.
 */
const TermsOfServicePage = () => (
  <LegalPageLayout title="Terms of Service" lastUpdated="18 August 2026">
    <p className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
      <strong>Draft notice:</strong> these terms are a working draft and have not yet been reviewed
      by a legal professional. Please review before relying on them.
    </p>

    <LegalSection heading="1. Acceptance">
      <p>
        By creating an account or using Best Tuitions, you agree to these terms. If you do not agree,
        please do not use the platform.
      </p>
    </LegalSection>

    <LegalSection heading="2. What Best Tuitions is">
      <p>
        We are an introduction platform. We help parents and students find private tutors, and help
        tutors find work. <strong>We are not the employer of any tutor</strong>, we do not deliver
        tuition ourselves, and we are not a party to the arrangement you make with another user.
      </p>
    </LegalSection>

    <LegalSection heading="3. Accounts">
      <ul className="list-disc pl-6 space-y-1">
        <li>You must provide accurate information and keep it up to date.</li>
        <li>You are responsible for keeping your password confidential and for activity on your account.</li>
        <li>Tutor profiles are reviewed before they become visible; we may decline or remove a profile.</li>
        <li>We may suspend or deactivate accounts that breach these terms.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="4. Commission and contact details">
      <p>
        Tutors pay a platform commission in connection with engagements arranged through Best
        Tuitions. A parent's contact details are released to a tutor only after an administrator has
        verified the applicable payment.
      </p>
      <p>
        Deliberately circumventing the commission — for example by arranging payment off-platform
        specifically to avoid it — is a breach of these terms and may result in removal.
      </p>
      <p>
        Commission rates are set by the platform and may change; the rate applicable is the one in
        effect at the time of the engagement.
      </p>
    </LegalSection>

    <LegalSection heading="5. Acceptable use">
      <ul className="list-disc pl-6 space-y-1">
        <li>Do not post false, misleading, or fraudulent information, including fake qualifications.</li>
        <li>Do not harass, spam, or abuse other users through messaging or any other feature.</li>
        <li>Do not use another person's identity or account.</li>
        <li>Do not attempt to disrupt, probe, or gain unauthorised access to the platform.</li>
      </ul>
    </LegalSection>

    <LegalSection heading="6. Reviews and content">
      <p>
        You are responsible for content you submit, including reviews and messages. Reviews should be
        honest and based on genuine experience. We may remove content that is abusive, defamatory,
        or otherwise breaches these terms.
      </p>
    </LegalSection>

    <LegalSection heading="7. No guarantee">
      <p>
        We do not guarantee that a tutor will find work, that a parent will find a suitable tutor, or
        the quality or outcome of any tuition arranged. Verification of a profile means we reviewed
        the information submitted; it is not a guarantee of competence or conduct.
      </p>
      <p>
        We strongly recommend meeting or holding a demo session before committing to an arrangement.
      </p>
    </LegalSection>

    <LegalSection heading="8. Liability">
      <p>
        To the extent permitted by law, Best Tuitions is not liable for disputes, losses, or damages
        arising between users, or from tuition arranged through the platform. Our role is limited to
        providing the introduction service.
      </p>
    </LegalSection>

    <LegalSection heading="9. Changes and termination">
      <p>
        We may update these terms; continued use after an update means you accept the revised terms.
        You may stop using the platform and request account deletion at any time.
      </p>
    </LegalSection>

    <LegalSection heading="10. Contact">
      <p>Questions about these terms can be sent via our Contact page.</p>
    </LegalSection>
  </LegalPageLayout>
);

export default TermsOfServicePage;
