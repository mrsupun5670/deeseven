import "../global.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function Policy() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen text-gray-800">
        <Header />

        <div className=" container mx-auto px-4 md:px-14 pt-10 pb-24 md:pb-10">
          <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

          <p className="mb-6">
            At <strong>Deezeven</strong>, we are committed to protecting your privacy and ensuring that your personal information is handled securely and responsibly. By using our website, you agree to the practices outlined in this policy.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-2">Personal Information We Collect</h2>
              <p>
                We will not collect personally identifiable information (such as your name, address, phone number, or email address) unless you voluntarily provide it—during checkout, account registration, or when contacting us.
              </p>
              <p className="mt-2">
                We may also collect non-personally identifiable information such as browser type, device information, IP address, and general browsing behavior to help improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>To process and fulfill your orders securely, including shipping and delivery.</li>
                <li>To respond to your inquiries, provide customer support, and update you on your order.</li>
                <li>To personalize your shopping experience and deliver relevant promotions.</li>
                <li>To improve our website and services based on your feedback and behavior.</li>
                <li>To prevent fraudulent activity or abuse of our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Marketing Communications</h2>
              <p>
                If you opt in, we may contact you with updates, promotions, or new product announcements via email or SMS. You can unsubscribe anytime by clicking the link in our emails or contacting us at{" "}
                <a href="mailto:info@deezevenclothing.com" className="text-blue-600 underline">info@deezevenclothing.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Third-Party Services</h2>
              <p>
                We may share your information with trusted third-party service providers for the sole purpose of delivering services such as:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Processing payments (e.g., <strong>PayHere</strong>)</li>
                <li>Shipping and logistics</li>
                <li>Marketing communication under our direct control</li>
              </ul>
              <p className="mt-2">
                These providers are contractually obligated to keep your data secure and use it only to support Deezeven operations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">What We Don’t Do</h2>
              <p>
                We will <strong>never sell, rent, or trade your personal information</strong> to third-party organizations for their marketing use without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Children’s Privacy</h2>
              <p>
                We do not knowingly collect personal information from children under the age of 13. If you believe a child has submitted data to us, please email us at{" "}
                <a href="mailto:info@deezevenclothing.com" className="text-blue-600 underline">info@deezevenclothing.com</a> and we will remove the data promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Cookies & Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, track website usage, and offer personalized content.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Session cookies</strong>: Temporary, deleted when you leave the site.</li>
                <li><strong>Persistent cookies</strong>: Remain until manually deleted by you.</li>
              </ul>
              <p className="mt-2">
                These cookies do not collect personal data unless you submit it voluntarily. You can disable cookies in your browser settings, but this may limit site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Pixel Tags</h2>
              <p>
                We may use pixel tags (also known as beacon gifs) for email campaign tracking and to better understand customer behavior. These tags help us know if an email was opened and improve the delivery of HTML-based emails.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">External Links</h2>
              <p>
                Our website may contain links to third-party sites. We are not responsible for their privacy practices and encourage you to review their policies before submitting any information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information. However, no system is 100% secure. Always use strong passwords and update them periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Policy Updates</h2>
              <p>
                We reserve the right to modify this policy at any time. Updates will be posted on this page with a revised “Last Updated” date. Continued use of the site constitutes your acceptance of the changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
              <p>
                For questions about this Privacy Policy, email us at{" "}
                <a href="mailto:info@deezevenclothing.com" className="text-blue-600 underline">info@deezevenclothing.com</a>. We're happy to assist you.
              </p>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
