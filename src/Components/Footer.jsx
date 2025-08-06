import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="container mx-auto px-4 md:px-14 pt-10 pb-24 md:pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div>
          <h3 className="text-lg font-semibold">Deezeven Clothing Company</h3>
          <p className="text-gray-600 mt-2 text-justify">
          At Deezeven Clothing, we are dedicated to redefining fashion with a purpose. Our mission is to empower individuals with high-quality, versatile apparel that embodies confidence, ambition, and self-expression. With unwavering dedication, we craft each piece to inspire success, ensuring that every step you take is one towards achievement. Join us on this journey of passion, innovation, and timeless style.
          </p>
          <a href="#" className="text-black font-bold mt-3 inline-block">
            Learn more about Deezeven
          </a>
        </div>

        <div>
          <h3 className="text-lg font-semibold">SHOP</h3>
          <ul className="text-gray-600 space-y-1 mt-2">
            <li><a href="/women">Women’s Clothing</a></li>
            <li><a href="/men">Men’s Clothing</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">HELP</h3>
          <ul className="text-gray-600 space-y-1 mt-2">
            <li><a href="/terms_conditions">Terms & Conditions</a></li>
            <li><a href="/privacy_policy">Privacy Policy</a></li>
            <li><a href="/return_policy">Refund Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Need Help?</h3>
          <div className="rounded-md mt-2 flex items-center">
            <div className="mr-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                   alt="WhatsApp" className="w-6 h-6" />
            </div>
            <div>
              <p className="">Need Help? Chat us via WhatsApp</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Mon-Friday: 8.30 am – 5.00 pm <br />
            Slow Or No Response On Mercantile And Public Holidays,
          </p>
          <div className="flex items-center text-gray-700 mt-2">
            <Mail className="w-5 h-5 mr-2 text-black" />
            <span>info@deezevenclothing.com</span>
          </div>
        </div>
      </div>

      <div className="border-t mt-8 pt-4 text-center text-gray-600 text-sm">
        © Deezeven Clothing 2025. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
