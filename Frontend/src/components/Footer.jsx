import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="luxury-container py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-yellow-600 font-bold mb-4">About Us</h3>
            <p className="text-gray-300 text-sm">
              Aurelle Maison offers luxury furniture for discerning tastes.
            </p>
          </div>

          <div>
            <h3 className="text-yellow-600 font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-yellow-600">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-yellow-600">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-yellow-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-yellow-600 font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-yellow-600">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-yellow-600">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-yellow-600">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-yellow-600 font-bold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm">
              Email: info@aurellemaison.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Aurelle Maison. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
