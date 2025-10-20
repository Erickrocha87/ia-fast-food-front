export default function Settings() {
  return (
    <div className="bg-white w-full max-w-3xl mx-auto min-h-screen p-10 rounded-2xl shadow-md">
      {/* Cabeçalho */}
      <div className="flex flex-col items-center text-center mb-10">
        <img
          src="/serveai-logo.png"
          alt="ServeAI"
          className="w-40 h-40 mb-3"
        />
        <h1 className="text-2xl font-bold text-gray-800">Configuração do Restaurante</h1>
        <p className="text-gray-500 mt-1">
          Adicione as informações finais do seu restaurante
        </p>
      </div>

      {/* Formulário */}
      <form className="space-y-5">
        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço Completo
          </label>
          <input
            type="text"
            placeholder="Rua Exemplo, 123 - Bairro, Cidade"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Horário de funcionamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário de Funcionamento
          </label>
          <input
            type="text"
            placeholder="Ex: Seg-Sex, 9h às 22h"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload de logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo do Restaurante
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition">
            <input type="file" id="logo" className="hidden" />
            <label htmlFor="logo" className="cursor-pointer text-gray-500">
              Envie seu logo (clique ou arraste aqui)
            </label>
          </div>
        </div>

        {/* Termos */}
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            Aceito os Termos e Condições
          </label>
        </div>

        {/* Botão */}
        <button
          type="button"
          className="w-full py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Completar Configuração
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-10">
        Desenvolvido por ServeAI
      </p>
    </div>
  );
}
