import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function PrivacyPolicy() {
  return (
    <GuestLayout title="Privacy Policy">
      <div className="py-12 bg-muted">
        <div className="container max-w-4xl mx-auto bg-background rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="lead">Last updated: May 12, 2024</p>

            <p>
              At TekRem, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our ERP system and related services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access our services.
            </p>

            <h2>Information We Collect</h2>

            <p>
              We collect information that you provide directly to us when you:
            </p>

            <ul>
              <li>Register for an account</li>
              <li>Use our services</li>
              <li>Communicate with us</li>
              <li>Subscribe to our newsletter</li>
              <li>Request customer support</li>
            </ul>

            <p>
              The types of information we may collect include:
            </p>

            <ul>
              <li>Personal identifiers (name, email address, phone number)</li>
              <li>Business information (company name, job title)</li>
              <li>Login credentials</li>
              <li>Payment information</li>
              <li>User content (data files, documents)</li>
              <li>Usage data (features used, time spent)</li>
            </ul>

            <h2>How We Use Your Information</h2>

            <p>
              We may use the information we collect for various purposes, including to:
            </p>

            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative messages and updates</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Provide customer service and technical support</li>
              <li>Send marketing communications</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Data Security</h2>

            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>

            <h2>Data Retention</h2>

            <p>
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>

            <h2>Disclosure of Your Information</h2>

            <p>
              We may share information in the following situations:
            </p>

            <ul>
              <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information where we are legally required to do so.</li>
            </ul>

            <h2>Your Rights</h2>

            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>

            <ul>
              <li>The right to access the personal information we have about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>

            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>

            <h2>Children's Privacy</h2>

            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>

            <h2>Changes to This Privacy Policy</h2>

            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2>Contact Us</h2>

            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>

            <address>
              TekRem<br />
              123 Cairo Road<br />
              Lusaka, Zambia<br />
              Email: privacy@tekrem.com<br />
              Phone: +260 97 1234567
            </address>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
