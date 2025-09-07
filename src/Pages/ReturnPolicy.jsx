import "../global.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function ReturnPolicy() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen text-gray-800">
        <Header />

        <div className=" container mx-auto px-4 md:px-14 pt-10 pb-24 md:pb-10">
          <h1 className="text-3xl font-bold mb-6 text-center">Return & Refund Policy</h1>

          <p className="mb-6">
            Thank you for shopping with <strong>Deezeven</strong>. We value your satisfaction and want to ensure that your shopping experience is smooth and transparent. Please review our policy below.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-2">Eligibility for Returns</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Returns are accepted within <strong>7 days</strong> of delivery.</li>
                <li>Items must be <strong>unused, unwashed, and free of stains, odors, or damages</strong>.</li>
                <li>Tags may be removed, but <strong>must be returned</strong> with the original packaging.</li>
                <li>Returns are <strong>not accepted for size, color, or style changes</strong>.</li>
                <li>Items with <strong>perfume, smoke, detergent, or any strong odor</strong> will be rejected.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Non-Returnable Conditions</h2>
              <p>
                Items returned that do not meet our policy conditions—such as washed items, stained fabrics, or items with strong scents—will be rejected and not refunded or exchanged. Dislike, preference change, or fit issues are <strong>not valid reasons for return</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Exchanges</h2>
              <p>
                We only offer exchanges for items with <strong>factory faults</strong>. To request an exchange, please contact our support team and include clear photos of the defect. All decisions are subject to approval.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Refunds</h2>
              <p>
                We do <strong>not issue cash refunds</strong>. If your return is approved, you may exchange the item for a similar product or store credit. Please note that availability of replacement items may vary.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Return Shipping</h2>
              <p>
                The customer is responsible for all return shipping costs. We recommend returning the item using the original packaging to avoid damage in transit. If the original packaging is unavailable, use a secure alternative with adequate protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Defective Items</h2>
              <p>
                If your item arrives damaged or faulty, contact us within 7 days of delivery. Email a clear image of the defect to{' '}
                <a href="mailto:info@deezevenclothing.com" className="text-blue-600 underline">info@deezevenclothing.com</a>. Once reviewed and approved, we will guide you through the exchange process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Important Notes</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>All items are carefully quality-checked before shipment.</li>
                <li>Actual colors may vary slightly from images due to device display differences.</li>
                <li>Please return all items from a single order together to ensure prompt processing.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
              <p>
                If you have any questions about returns, exchanges, or refunds, please reach out to our team at{' '}
                <a href="mailto:info@deezevenclothing.com" className="text-blue-600 underline">info@deezevenclothing.com</a>. We’re here to help!
              </p>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
