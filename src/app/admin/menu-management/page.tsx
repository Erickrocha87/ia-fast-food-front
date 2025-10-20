export default function MenuManagementPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Menu Management</h1>
      <p className="text-gray-600 mb-8">Gerencie os itens, preços e descrições do cardápio.</p>
      <div className="bg-white p-8 rounded-xl shadow">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow">
          + Add New Dish
        </button>
      </div>
    </section>
  );
}
