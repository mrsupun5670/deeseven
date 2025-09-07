import "../global.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function TermsConditions() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen text-gray-800">
        <Header />

        <div className=" container mx-auto px-4 md:px-14 pt-10 pb-24 md:pb-10">
          <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>

          <p className="mb-6">
            Welcome to <strong>Deezeven</strong>. These Terms and Conditions govern your use of our website (
            <a href="https://www.deezeven.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              www.deezeven.com
            </a>) and any purchases made through our platform. By accessing or using our website, you agree to comply with the following terms.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-2">Eligibility</h2>
              <p>You must be at least 16 years of age to use this website. By continuing to use this site, you confirm that you meet this age requirement.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Account and User Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                You agree to provide accurate and current information and to use this site only for lawful purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Order Confirmation</h2>
              <p>
                All orders are subject to confirmation. Receiving a confirmation email does not signify acceptance or fulfillment. We reserve the right to cancel or refuse any order at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Pricing and Accuracy</h2>
              <p>
                While we strive to keep product details and prices accurate, errors may occur. We reserve the right to correct inaccuracies or cancel orders if necessary. Prices and offers may change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Product Descriptions</h2>
              <p>
                Product colors and dimensions may vary slightly based on screen settings. All listed measurements are approximate. Product availability is not guaranteed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Shipping Policy</h2>
              <p>
                Orders will be shipped to the address provided during checkout. Risk of loss transfers to the buyer upon handover to the shipping carrier. Claims for lost or damaged items must be filed with the carrier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Returns & Exchanges</h2>
              <p>
                For full details, refer to our{' '}
                <a href="/return-policy" className="text-blue-600 underline">
                  Return & Refund Policy
                </a>. 
                In summary:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Returns are accepted within 7 days of delivery.</li>
                <li>Items must be unwashed, unused, and free from damage, stains, or odors.</li>
                <li>It’s okay to remove tags, but all tags and original packaging must be included in the return.</li>
                <li>No returns for dislike, size, color, or style changes.</li>
                <li>No cash refunds; eligible items may be exchanged after approval.</li>
                <li>Return shipping charges must be paid by the customer.</li>
                <li>Only manufacturing defects are eligible for exchange.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Payment Security</h2>
              <p>
                We use trusted third-party providers such as <strong>PayHere</strong> to handle payments securely. Your payment details are encrypted and are not stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
              <p>
                All content on this website—including logos, text, images, and graphics—is owned by Deezeven or its licensors. You may not reuse, reproduce, or modify any part of the content without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Third-Party Links</h2>
              <p>
                Our website may link to external websites for convenience. We are not responsible for the content or practices of those sites. Use third-party websites at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Limitation of Liability</h2>
              <p>
                Deezeven is not liable for any indirect or consequential damages resulting from use of this site, order errors, delivery issues, or unauthorized access to personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Deezeven and its affiliates from any claims, liabilities, or losses arising from your misuse of the website or breach of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Modifications and Termination</h2>
              <p>
                We may modify these Terms & Conditions at any time without notice. Changes will be posted on this page. Continued use of the site implies acceptance of the updated terms. We also reserve the right to suspend or terminate any account for violations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Contact</h2>
              <p>
                For any questions, feel free to contact us at{' '}
                <a href="mailto:info@deezevenclothing.com" className="text-blue-600 underline">
                  info@deezevenclothing.com                </a>.
              </p>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
