import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <GuestLayout title="Terms of Service | Tekrem">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: May 15, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-16">
        <div className="container mx-auto">
          <Card>
            <CardContent className="pt-6 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p>
                  Welcome to Tekrem. These terms and conditions outline the rules and regulations for the use of Tekrem's website and services.
                </p>
                <p className="mt-4">
                  By accessing this website or using our services, we assume you accept these terms and conditions in full. Do not continue to use Tekrem's website or services if you do not accept all of the terms and conditions stated on this page.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Definitions</h2>
                <p>
                  The following terminology applies to these Terms and Conditions, Privacy Statement, and any or all Agreements:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>"Client", "You" and "Your"</strong> refers to you, the person accessing this website and accepting the Company's terms and conditions.
                  </li>
                  <li>
                    <strong>"The Company", "Ourselves", "We", "Our" and "Us"</strong> refers to Tekrem.
                  </li>
                  <li>
                    <strong>"Party", "Parties", or "Us"</strong> refers to both the Client and ourselves, or either the Client or ourselves.
                  </li>
                  <li>
                    <strong>"Services"</strong> refers to the services provided by Tekrem as described on our website.
                  </li>
                </ul>
                <p className="mt-4">
                  All terms refer to the offer, acceptance, and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a fixed duration, or any other means, for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services/products, in accordance with and subject to, prevailing law of Zambia.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">License</h2>
                <p>
                  Unless otherwise stated, Tekrem and/or its licensors own the intellectual property rights for all material on Tekrem's website and services. All intellectual property rights are reserved.
                </p>
                <p className="mt-4">
                  You may view and/or print pages from our website for your own personal use subject to restrictions set in these terms and conditions.
                </p>
                <p className="mt-4">
                  You must not:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Republish material from this website</li>
                  <li>Sell, rent, or sub-license material from this website</li>
                  <li>Reproduce, duplicate, or copy material from this website</li>
                  <li>Redistribute content from Tekrem (unless content is specifically made for redistribution)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">User Content</h2>
                <p>
                  In these terms and conditions, "User Content" means material (including without limitation text, images, audio material, video material, and audio-visual material) that you submit to our website or services, for whatever purpose.
                </p>
                <p className="mt-4">
                  You grant to Tekrem a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your User Content in any existing or future media. You also grant to Tekrem the right to sub-license these rights, and the right to bring an action for infringement of these rights.
                </p>
                <p className="mt-4">
                  Your User Content must not be illegal or unlawful, must not infringe any third party's legal rights, and must not be capable of giving rise to legal action whether against you or Tekrem or a third party (in each case under any applicable law).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Service Terms</h2>
                <p>
                  Tekrem provides various technology services as described on our website. By engaging our services, you agree to the following terms:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Service Delivery:</strong> We will provide the services with reasonable skill and care in accordance with industry standards.
                  </li>
                  <li>
                    <strong>Client Cooperation:</strong> You agree to provide us with the cooperation, information, and access necessary to deliver the services.
                  </li>
                  <li>
                    <strong>Payment Terms:</strong> Payment terms will be specified in the service agreement or invoice. Unless otherwise stated, payment is due within 30 days of invoice date.
                  </li>
                  <li>
                    <strong>Intellectual Property:</strong> Unless otherwise agreed in writing, we retain ownership of all intellectual property rights in the services and deliverables.
                  </li>
                  <li>
                    <strong>Confidentiality:</strong> Both parties agree to maintain the confidentiality of any confidential information shared during the provision of services.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, Tekrem excludes all representations, warranties, and conditions relating to our website and services and the use of this website and services (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose, and/or the use of reasonable care and skill).
                </p>
                <p className="mt-4">
                  Nothing in these terms and conditions will:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Limit or exclude our or your liability for death or personal injury resulting from negligence</li>
                  <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation</li>
                  <li>Limit any of our or your liabilities in any way that is not permitted under applicable law</li>
                  <li>Exclude any of our or your liabilities that may not be excluded under applicable law</li>
                </ul>
                <p className="mt-4">
                  The limitations and exclusions of liability set out in this Section and elsewhere in these terms and conditions:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Are subject to the preceding paragraph</li>
                  <li>Govern all liabilities arising under the terms and conditions or in relation to the subject matter of the terms and conditions, including liabilities arising in contract, in tort (including negligence), and for breach of statutory duty</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Indemnity</h2>
                <p>
                  You hereby indemnify Tekrem and undertake to keep Tekrem indemnified against any losses, damages, costs, liabilities, and expenses (including, without limitation, legal expenses and any amounts paid by Tekrem to a third party in settlement of a claim or dispute on the advice of Tekrem's legal advisers) incurred or suffered by Tekrem arising out of any breach by you of any provision of these terms and conditions, or arising out of any claim that you have breached any provision of these terms and conditions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Breaches of These Terms and Conditions</h2>
                <p>
                  Without prejudice to Tekrem's other rights under these terms and conditions, if you breach these terms and conditions in any way, Tekrem may take such action as Tekrem deems appropriate to deal with the breach, including suspending your access to the website, prohibiting you from accessing the website, blocking computers using your IP address from accessing the website, contacting your internet service provider to request that they block your access to the website, and/or bringing court proceedings against you.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Variation</h2>
                <p>
                  Tekrem may revise these terms and conditions from time-to-time. Revised terms and conditions will apply to the use of our website and services from the date of publication of the revised terms and conditions on our website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Assignment</h2>
                <p>
                  Tekrem may transfer, sub-contract, or otherwise deal with Tekrem's rights and/or obligations under these terms and conditions without notifying you or obtaining your consent.
                </p>
                <p className="mt-4">
                  You may not transfer, sub-contract, or otherwise deal with your rights and/or obligations under these terms and conditions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Severability</h2>
                <p>
                  If a provision of these terms and conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect. If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Entire Agreement</h2>
                <p>
                  These terms and conditions, together with our privacy policy, constitute the entire agreement between you and Tekrem in relation to your use of our website and services, and supersede all previous agreements in respect of your use of this website and services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Law and Jurisdiction</h2>
                <p>
                  These terms and conditions will be governed by and construed in accordance with the laws of Zambia, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Zambia.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p>
                  If you have any questions about these terms and conditions, please contact us at:
                </p>
                <div className="mt-4">
                  <p><strong>Email:</strong> legal@tekrem.com</p>
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
