// =============================================
// TABELA DE OPERAÇÕES
// Lista compras e vendas de ativos
// =============================================

import { Pencil, Trash2 } from 'lucide-react'

// Tipo local da operação
interface Operacao {
  id: number
  tipo: string
  categoria: string
  ticker: string
  quantidade: number
  preco_unitario: number
  taxas: number
  total: number
  data: string
  corretora?: string
  observacoes?: string
  preco_medio?: number
  lucro_prejuizo?: number
  imposto_devido?: number
}

interface Props {
  operacoes?: Operacao[]
  loading: boolean
  onEditar: (op: Operacao) => void
  onExcluir: (id: number) => void
}

function formatReal(valor: number) {
  return valor?.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }) ?? 'R$ 0,00'
}

export default function TabelaOperacoes({
  operacoes = [],
  loading,
  onEditar,
  onExcluir
}: Props) {

  // Tela de carregamento
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        Carregando operações...
      </div>
    )
  }

  // Lista vazia
  if (!operacoes || operacoes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
        Nenhuma operação registrada
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3">Data</th>
              <th className="text-left px-5 py-3">Ticker</th>
              <th className="text-left px-5 py-3">Tipo</th>
              <th className="text-left px-5 py-3">Qtd</th>
              <th className="text-left px-5 py-3">Preço</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-center px-5 py-3">Ações</th>
            </tr>
          </thead>

          <tbody>
            {operacoes.map((op) => (
              <tr
                key={op.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >

                {/* Data */}
                <td className="px-5 py-3">
                  {new Date(op.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                </td>

                {/* Ticker */}
                <td className="px-5 py-3 font-bold text-blue-700">
                  {op.ticker}
                </td>

                {/* Tipo */}
                <td className="px-5 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      op.tipo === 'COMPRA'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {op.tipo}
                  </span>
                </td>

                {/* Quantidade */}
                <td className="px-5 py-3">
                  {op.quantidade}
                </td>

                {/* Preço */}
                <td className="px-5 py-3">
                  {formatReal(op.preco_unitario)}
                </td>

                {/* Total */}
                <td className="px-5 py-3 font-semibold">
                  {formatReal(op.total)}
                </td>

                {/* Ações */}
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-2">

                    <button
                      onClick={() => onEditar(op)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => onExcluir(op.id)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}