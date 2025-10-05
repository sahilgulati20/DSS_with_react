import React from 'react';
import { Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import contactpagebg from "../images/contactpagebg.png";

export default function ContactUs() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .font-main { font-family: 'Poppins', sans-serif; }
      `}</style>

      <section
        id="contact"
        className="relative bg-cover bg-center py-24 text-white font-main"
        style={{
          backgroundImage: `url(${contactpagebg})`,
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

        <div className="relative container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT SIDE - Info */}
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                Contact Us
              </h2>
              <p className="text-lg text-gray-300 max-w-md leading-relaxed">
                Have questions, feedback, or collaboration ideas? We’d love to hear
                from you. Reach out and our team will get back to you soon.
              </p>

              <div className="flex space-x-6 mt-8">
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-500 transition-transform transform hover:scale-110"
                >
                  <Twitter size={32} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-500 transition-transform transform hover:scale-110"
                >
                  <Instagram size={32} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-500 transition-transform transform hover:scale-110"
                >
                  <Linkedin size={32} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-green-500 transition-transform transform hover:scale-110"
                >
                  <Youtube size={32} />
                </a>
              </div>
            </div>

            {/* RIGHT SIDE - Form */}
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-lg">
              <h3 className="text-3xl font-bold text-white mb-2">
                Get a Quote
              </h3>
              <p className="text-gray-300 mb-6">
                Fill out the form and we’ll reach out within 24 hours.
              </p>

              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full bg-white/20 text-white placeholder-gray-300 p-3 rounded-lg border border-transparent focus:border-green-400 focus:bg-white/30 outline-none transition"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full bg-white/20 text-white placeholder-gray-300 p-3 rounded-lg border border-transparent focus:border-green-400 focus:bg-white/30 outline-none transition"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/20 text-white placeholder-gray-300 p-3 rounded-lg border border-transparent focus:border-green-400 focus:bg-white/30 outline-none transition"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-white/20 text-white placeholder-gray-300 p-3 rounded-lg border border-transparent focus:border-green-400 focus:bg-white/30 outline-none transition"
                />
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className="w-full bg-white/20 text-white placeholder-gray-300 p-3 rounded-lg border border-transparent focus:border-green-400 focus:bg-white/30 outline-none transition"
                ></textarea>

                <button
                  type="submit"
                  className="w-full mt-2 bg-gradient-to-r from-green-700 to-emerald-900 text-white font-semibold py-3 px-6 rounded-full hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
