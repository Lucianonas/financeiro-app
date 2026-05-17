// =============================================
// PÁGINA DE LANÇAMENTOS FINANCEIROS
// Controla salários, receitas e despesas
// =============================================

import { useEffect, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import api from '../services/api'

// Importa os componentes modulares
import TabelaLancamentos from '../components/lancamentos/TabelaLancamentos'
import ModalLancamento from '../components/lancamentos/ModalLancamento'
import FiltrosLancamentos from '../components/lancamentos/FiltrosLancamentos'
import MensagemAlerta from '../components/common/MensagemAlerta'
import ModalConfirmacao from '../components/common/ModalConfirmacao'

// Tipo de um lançamento
export interface Lancamento {
  id: number
  tipo: string
  categoria: string
  descricao: string
  valor: number
  data: string
  recorrente: string
  status: string
  declarar_ir: string
  fonte_pagadora?: string
  cnpj_fonte?: string
  observacoes?: string
}

// Estado inicial do formulário vazio
export const FORM_VAZIO = {
  tipo: 'RECEITA',
  categoria: 'SALARIO',
  descricao: '',
  valor: '',
  data: new Date().toISOString().split('T')[0],
  recorrente: 'NAO',
  status: 'PAGO',
  declarar_ir: 'NAO',
  fonte_pagadora: '',
  cnpj_fonte: '',
  observacoes: ''
}

export default function Lancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [form, setForm] = useState<any>(FORM_VAZIO)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })
  const [confirmarExclusao, setConfirmarExclusao] = useState<number | null>(null)

  useEffect(() => { buscarLancamentos() }, [])

  // Busca lançamentos do backend com filtro opcional
  async function buscarLancamentos() {
    setLoading(true)
    try {
      const params: any = {}
      if (filtroTipo) params.tipo = filtroTipo
      const response = await api.get('/lancamentos/', { params })
      setLancamentos(response.data)
    } catch {
      mostrarMensagem('Erro ao buscar lançamentos', 'erro')
    } finally {
      setLoading(false)
    }
  }

  // Mostra mensagem temporária por 3 segundos
  function mostrarMensagem(texto: string, tipo: string) {
    setMensagem({ texto, tipo })
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000)
  }

  // Abre modal para novo lançamento
  function novoLancamento() {
    setForm(FORM_VAZIO)
    setEditandoId(null)
    setModalAberto(true)
  }

  // Abre modal preenchido para edição
  function editarLancamento(l: Lancamento) {
    setForm({
      ...l,
      valor: l.valor.toString(),
      fonte_pagadora: l.fonte_pagadora ?? '',
      cnpj_fonte: l.cnpj_fonte ?? '',
      observacoes: l.observacoes ?? ''
    })
    setEditandoId(l.id)
    setModalAberto(true)
  }

  // Salva novo ou atualiza existente
  async function salvarLancamento() {
    try {
      const dados = { ...form, valor: parseFloat(form.valor) }
      if (editandoId) {
        await api.put(`/lancamentos/${editandoId}`, dados)
        mostrarMensagem('Lançamento atualizado!', 'sucesso')
      } else {
        await api.post('/lancamentos/', dados)
        mostrarMensagem('Lançamento criado!', 'sucesso')
      }
      setModalAberto(false)
      buscarLancamentos()
    } catch (err: any) {
      mostrarMensagem(err.response?.data?.detail ?? 'Erro ao salvar', 'erro')
    }
  }

  // Deleta após confirmação
  async function deletarLancamento(id: number) {
    try {
      await api.delete(`/lancamentos/${id}`)
      mostrarMensagem('Lançamento excluído!', 'sucesso')
      setConfirmarExclusao(null)
      buscarLancamentos()
    } catch {
      mostrarMensagem('Erro ao excluir', 'erro')
    }
  }

  // Filtra pelo texto digitado na busca
  const lancamentosFiltrados = lancamentos.filter(l =>
    l.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    l.categoria.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lançamentos Financeiros</h2>
          <p className="text-gray-500 text-sm mt-1">Controle suas receitas e despesas</p>
        </div>
        <button
          onClick={novoLancamento}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Novo Lançamento
        </button>
      </div>

      {/* Mensagem de sucesso ou erro */}
      <MensagemAlerta mensagem={mensagem} />

      {/* Barra de busca e filtros */}
      <FiltrosLancamentos
        busca={busca}
        setBusca={setBusca}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        onAtualizar={buscarLancamentos}
      />

      {/* Tabela de lançamentos */}
      <TabelaLancamentos
        lancamentos={lancamentosFiltrados}
        loading={loading}
        onEditar={editarLancamento}
        onExcluir={(id) => setConfirmarExclusao(id)}
      />

      {/* Modal de confirmação de exclusão */}
      <ModalConfirmacao
        aberto={confirmarExclusao !== null}
        onConfirmar={() => deletarLancamento(confirmarExclusao!)}
        onCancelar={() => setConfirmarExclusao(null)}
        mensagem="Tem certeza que deseja excluir este lançamento?"
      />

      {/* Modal de formulário */}
      <ModalLancamento
        aberto={modalAberto}
        form={form}
        setForm={setForm}
        editandoId={editandoId}
        onSalvar={salvarLancamento}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  )
}