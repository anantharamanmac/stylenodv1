const collections = [
  { name: "Men", img: "https://source.unsplash.com/400x400/?men,fashion" },
  { name: "Women", img: "https://source.unsplash.com/400x400/?women,fashion" },
  { name: "Accessories", img: "https://source.unsplash.com/400x400/?accessories" },
];

function CollectionGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {collections.map((col) => (
        <div key={col.name} className="relative group cursor-pointer">
          <img
            src={col.img}
            alt={col.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-xl font-semibold">{col.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CollectionGrid;
