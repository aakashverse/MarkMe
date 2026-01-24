import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-5 mb-0 p-0 bg-dark text-light">
      <div className="container pt-5">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">About Mark_Me</h5>
            <p className="mt-3">
              A modern platform for seamless classroom attendance using smart
              sessions and camera-ready UI.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Privacy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Contact</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2">📧 support@mark_me.app</li>
              <li className="mb-2">📞 +1 (555) 123-4567</li>
              <li className="mb-2">📍 123 Campus Road, Tech City</li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="col-md-2 mb-4">
            <h5 className="fw-bold">Follow</h5>
            <div className="d-flex gap-3 mt-3">
              <div className="border rounded-circle p-2">
                <FaFacebookF size={18} />
              </div>
              <div className="border rounded-circle p-2">
                <FaTwitter size={18} />
              </div>
              <div className="border rounded-circle p-2">
                <FaLinkedinIn size={18} />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Bottom Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <p className="mb-0">© 2026 Mark_Me. All rights reserved.</p>
          <p className="mb-0">
            Crafted with <FaHeart className="text-danger" /> by AAKASH
          </p>
        </div>
      </div>
    </footer>
  );
}
