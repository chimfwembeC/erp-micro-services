import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <GuestLayout title="Privacy Policy | Tekrem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: May 15, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto">
          <Card>
            <CardContent className="pt-6 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p>
                  At Tekrem, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                </p>
                <p className="mt-4">
                  This privacy policy applies to all personal data collected through our website, as well as any related services, sales, marketing, or events.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">The Data We Collect</h2>
                <p>
                  We collect several different types of information for various purposes to provide and improve our service to you. The types of data we may collect include:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Personal Identification Information:</strong> Name, email address, phone number, company name, job title, etc.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> IP address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our website.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information about how you use our website, products, and services.
                  </li>
                  <li>
                    <strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us and our third parties and your communication preferences.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">How We Collect Your Data</h2>
                <p>
                  We use different methods to collect data from and about you, including:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Direct Interactions:</strong> You may provide us with your personal data by filling in forms on our website, corresponding with us by post, phone, email, or otherwise.
                  </li>
                  <li>
                    <strong>Automated Technologies:</strong> As you interact with our website, we may automatically collect technical data about your equipment, browsing actions, and patterns.
                  </li>
                  <li>
                    <strong>Third Parties:</strong> We may receive personal data about you from various third parties such as analytics providers, advertising networks, and search information providers.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">How We Use Your Data</h2>
                <p>
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    Where we need to perform the contract we are about to enter into or have entered into with you.
                  </li>
                  <li>
                    Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
                  </li>
                  <li>
                    Where we need to comply with a legal or regulatory obligation.
                  </li>
                  <li>
                    Where you have provided consent for us to process your personal data for a specific purpose.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p>
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                </p>
                <p className="mt-4">
                  We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
                <p>
                  We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                </p>
                <p className="mt-4">
                  To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data, and whether we can achieve those purposes through other means, and the applicable legal requirements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Your Legal Rights</h2>
                <p>
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Request access</strong> to your personal data.
                  </li>
                  <li>
                    <strong>Request correction</strong> of your personal data.
                  </li>
                  <li>
                    <strong>Request erasure</strong> of your personal data.
                  </li>
                  <li>
                    <strong>Object to processing</strong> of your personal data.
                  </li>
                  <li>
                    <strong>Request restriction of processing</strong> your personal data.
                  </li>
                  <li>
                    <strong>Request transfer</strong> of your personal data.
                  </li>
                  <li>
                    <strong>Right to withdraw consent</strong> where we are relying on consent to process your personal data.
                  </li>
                </ul>
                <p className="mt-4">
                  If you wish to exercise any of these rights, please contact us using the details provided below.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                <p>
                  Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
                </p>
                <p className="mt-4">
                  You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
                <p>
                  We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this privacy policy.
                </p>
                <p className="mt-4">
                  You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                </p>
                <div className="mt-4">
                  <p><strong>Email:</strong> privacy@tekrem.com</p>
                  <p><strong>Phone:</strong> +260 XXX XXX XXX</p>
                  <p><strong>Address:</strong> 123 Cairo Road, Lusaka, Zambia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </GuestLayout>
  );
}
