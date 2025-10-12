import React from "react";
import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";

// 🔹 Add social links in the data
const teamMembers = [
  {
    name: "Sahil Gulati",
    img: "/Sahil.jpg",
    role: "IoT & Agentic AI Developer",
    linkedin: "https://www.linkedin.com/in/sahil-gulati-663708320/", 
    facebook: "#",
    github: "https://github.com/sahilgulati",
  },
  {
    name: "Priyanshu Rajput",
    img: "/Priyanshu.jpg",
    role: "Full Stack Developer & AI/ML Specialist",
    linkedin: "https://www.linkedin.com/in/priyanshu-rajput-4b29322ab/",
    facebook: "https://facebook.com/priyanshu.rajput",
    github: "https://github.com/priyanshurajput",
  },
];

const Contact = () => {
  return (
    <section
      id="contact"
      className="relative py-24 text-center bg-gradient-to-b from-sky-100 to-white h-auto"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Our Team Section */}
        <h2 className="text-5xl font-bold mb-12 text-sky-600">Our Team</h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-30 max-w-6xl">
          {teamMembers.map((member, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Image card with hover effects */}
              <div className="relative group w-80 h-80 rounded-3xl overflow-hidden shadow-lg cursor-pointer">
                {/* Actual image */}
                <div
                  className="w-full h-full bg-cover bg-center transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ backgroundImage: `url(${member.img})` }}
                ></div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                  <span className="text-xl font-semibold text-white">
                    {member.name}
                  </span>
                  <span className="text-sm text-gray-300 mt-2">
                    ({member.role})
                  </span>
                </div>
              </div>

              {/* Social Icons (dynamic per person) */}
              <div className="flex justify-center gap-6 mt-4">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800 text-2xl transition-transform duration-300 hover:scale-125"
                  >
                    <FaLinkedin />
                  </a>
                )}
                {member.facebook && (
                  <a
                    href={member.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800 text-2xl transition-transform duration-300 hover:scale-125"
                  >
                    <FaFacebook />
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800 text-2xl transition-transform duration-300 hover:scale-125"
                  >
                    <FaGithub />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;