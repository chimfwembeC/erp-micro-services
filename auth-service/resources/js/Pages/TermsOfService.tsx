import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function TermsOfService() {
  return (
    <GuestLayout title="Terms of Service">
      <div className="py-12 bg-muted">
        <div className="container max-w-4xl mx-auto bg-background rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose max-w-none">
            <p className="lead">Last updated: May 12, 2024</p>

            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the TekRem ERP system and related services operated by TekRem ("us", "we", or "our").
            </p>

            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>

            <p>
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>

            <h2>1. Accounts</h2>

            <p>
              When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>

            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
            </p>

            <p>
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>

            <h2>2. Subscription and Payments</h2>

            <p>
              Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis, depending on the type of subscription plan you select.
            </p>

            <p>
              At the end of each period, your subscription will automatically renew under the same conditions unless you cancel it or TekRem cancels it.
            </p>

            <p>
              You may cancel your subscription renewal either through your online account management page or by contacting our customer support team.
            </p>

            <p>
              A valid payment method, including credit card, is required to process the payment for your subscription. You shall provide TekRem with accurate and complete billing information.
            </p>

            <h2>3. Content</h2>

            <p>
              Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
            </p>

            <p>
              By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person.
            </p>

            <h2>4. Intellectual Property</h2>

            <p>
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of TekRem and its licensors. The Service is protected by copyright, trademark, and other laws of both Zambia and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of TekRem.
            </p>

            <h2>5. Termination</h2>

            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>

            <h2>6. Limitation of Liability</h2>

            <p>
              In no event shall TekRem, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
            </p>

            <h2>7. Disclaimer</h2>

            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
            </p>

            <h2>8. Governing Law</h2>

            <p>
              These Terms shall be governed and construed in accordance with the laws of Zambia, without regard to its conflict of law provisions.
            </p>

            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>

            <h2>9. Changes to Terms</h2>

            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>

            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>

            <h2>10. Contact Us</h2>

            <p>
              If you have any questions about these Terms, please contact us at:
            </p>

            <address>
              TekRem<br />
              123 Cairo Road<br />
              Lusaka, Zambia<br />
              Email: legal@tekrem.com<br />
              Phone: +260 97 1234567
            </address>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
