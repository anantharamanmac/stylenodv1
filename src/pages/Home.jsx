import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CollectionGrid from "../components/CollectionGrid";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import ScrollingMessages from "../components/ScrollingMessages";
import OurSpecialities from "../components/OurSpecialities";

function Home() {
  return (
    <div className="font-sans bg-white text-black">
      <Navbar />
      <Hero />
      <ScrollingMessages />
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* <h2 className="text-2xl font-semibold mb-6">Featured Collections</h2>
        <CollectionGrid /> */}
      </section>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">The Style Nod Fashion</h2>
        <ProductGrid />
      </section>
      <OurSpecialities />
      <Footer />
    </div>
  );
}

export default Home;
