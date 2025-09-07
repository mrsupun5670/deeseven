import "../global.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function ContactUs() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen text-gray-800">
        <Header />

        <div className=" container mx-auto px-4 md:px-14 pt-10 pb-24 md:pb-10">
          <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

          <p className="text-lg text-gray-700 mb-10 text-center">
            We're here to help! Reach out with questions, feedback, or support
            needs and our team will respond as soon as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Email</h2>
                <p>
                  <a
                    href="mailto:info@deezevenclothing.com"
                    className="text-blue-600 underline"
                  >
                    info@deezevenclothing.com                  </a>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Phone</h2>
                <p>+94-XXXXXXXXX</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Business Hours</h2>
                <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                <p>Saturday: 10:00 AM – 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            <form className="bg-white p-6 rounded shadow-md space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Write your message..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full text-white py-2 px-4 rounded transition duration-300"
                style={{
                  backgroundColor: "#FFB700",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e6a800")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FFB700")
                }
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
