import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CollectionGrid from "../components/CollectionGrid";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import ScrollingMessages from "../components/ScrollingMessages";
import OurSpecialities from "../components/OurSpecialities";
import { FaShippingFast, FaLock, FaHeadset } from "react-icons/fa";

// Top Features Component
function TopFeatures() {
  const features = [
    {
      icon: <FaShippingFast className="text-3xl text-indigo-600 mb-1" />,
      title: "Free Shipping",
      description: "From all orders over Rs. 999",
    },
    {
      icon: <FaLock className="text-3xl text-indigo-600 mb-1" />,
      title: "Secure Payments",
      description: "Easy Payment Methods",
    },
    {
      icon: <FaHeadset className="text-3xl text-indigo-600 mb-1" />,
      title: "24/7 Support",
      description: "We have everything you need",
    },
  ];

  return (
    <section className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {feature.icon}
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About Stylenod Component
function AboutStylenod() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-6">
          About Stylenod
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif font-light">
          At <strong>Stylenod</strong>, we believe style is more than just what you wear, it’s how you express your story. Born in Kerala, our brand is rooted in authenticity, community, and a nod to timeless elegance. We begin our journey with a curated range of <strong>ethnic and daily wear for women</strong>, combining comfort, quality, and effortless grace. While we start with women’s fashion, we’re not stopping there; our vision is to grow into diverse categories, bringing thoughtfully designed clothing to everyone.
          <br /><br />
          Our fabrics are sourced from some of India’s most iconic textile hubs, the <strong>vibrant prints of Jaipur</strong>, the <strong>rich textures of Surat</strong>, and the <strong>trusted knits of Tirupur</strong>, each piece handpicked for its quality and character. These are then stitched by <strong>skilled local tailors in Kerala</strong>, empowering communities through employment and craftsmanship.
          <br /><br />
          With a commitment to <strong>premium packaging</strong> and a <strong>seamless delivery experience</strong>, we make sure every order feels like a special moment because you deserve more than just clothes. You deserve a style that speaks for you. At Stylenod, every thread carries a story of culture, care, and conscious choices. Because your style deserves more than trends — it deserves a <strong>nod to something real</strong>.
        </p>
        <div className="mt-8 w-16 h-0.5 bg-gray-400 mx-auto rounded-full"></div>
      </div>
    </section>
  );
}



function Home() {
  return (
    <div className="font-sans bg-white text-black">
      <Navbar />
      <Hero />
      <ScrollingMessages />

      {/* Featured Collections - currently commented */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* <h2 className="text-2xl font-semibold mb-6">Featured Collections</h2>
        <CollectionGrid /> */}
      </section>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">The Style Nod Fashion</h2>
        <ProductGrid />
      </section>

      {/* About Stylenod */}
      <AboutStylenod />

      {/* Top Features */}
      <TopFeatures />

      {/* Our Specialities */}
      <OurSpecialities />

      <Footer />
    </div>
  );
}

export default Home;
