// components/OurSpecialities.jsx
import React from "react";
import { FiGift, FiCheckCircle, FiScissors, FiLayers } from "react-icons/fi";

const specialities = [
  { icon: <FiGift className="w-8 h-8 mb-2" />, title: "Premium Packaging" },
  { icon: <FiCheckCircle className="w-8 h-8 mb-2" />, title: "Quality Checked" },
  { icon: <FiScissors className="w-8 h-8 mb-2" />, title: "Locally Crafted" },
  { icon: <FiLayers className="w-8 h-8 mb-2" />, title: "Limited Styles" },
  { icon: <span className="text-4xl mb-2">👕</span>, title: "Distinctive Designs" }, // T-shirt emoji instead of FaTshirt
  { icon: <span className="text-4xl mb-2">₹</span>, title: "Proudly Indian" }, // Unicode Rupee symbol
];

const OurSpecialities = () => {
  return (
    <section className="bg-[#1f3653] text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-sm uppercase tracking-widest mb-2">Our Brand</p>
        <h2 className="text-4xl font-semibold mb-6">Our Specialities</h2>
        <p className="mb-12 max-w-2xl">
          Blending comfort with elegance, we craft each piece using premium Indian fabrics and mindful tailoring.
          <br />
          At Stylenod, style isn’t just worn, it’s expressed.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {specialities.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {item.icon}
              <span className="mt-2 font-medium">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurSpecialities;
