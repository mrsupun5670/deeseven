import "../global.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function AboutUs() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen text-gray-800">
        <Header />

        <div className=" container mx-auto px-4 md:px-14 pt-10 pb-24 md:pb-10">
          <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

          <p className="mb-6 text-lg text-gray-700">
            <strong>Deezeven</strong> is more than just a textile shop – we are a celebration of comfort, elegance, and individuality. Founded with a passion for authentic style and everyday fashion, we bring thoughtfully designed garments that blend timeless craftsmanship with modern sensibilities.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
              <p>
                Starting from humble beginnings, Deezeven was built on the belief that quality fashion should be accessible, expressive, and trustworthy. What began as a small online store has grown into a beloved destination for shoppers who value both comfort and detail in what they wear.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Quality First:</strong> We focus on using materials that last and feel good.</li>
                <li><strong>Customer Respect:</strong> Every order is handled with care and attention.</li>
                <li><strong>Authenticity:</strong> Our collections are honest, bold, and rooted in cultural integrity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Why Shop With Us?</h2>
              <p>
                With fast shipping, clear policies, and attentive customer service, we ensure a smooth and satisfying experience from cart to closet. Whether you're upgrading your wardrobe or shopping for a special occasion, Deezeven is your trusted style partner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Join Our Journey</h2>
              <p>
                We’re grateful to have you with us. Stay connected through our newsletter or follow us on social media for the latest arrivals, exclusive offers, and behind-the-scenes moments.
              </p>
            </section>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
