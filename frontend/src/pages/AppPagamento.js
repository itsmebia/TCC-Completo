import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import QrCode from './QrCode';
import { v4 as uuidv4 } from 'uuid';

const idempotencyKey = uuidv4();
const API_URL = 'http://localhost:3001/pagamento/processar-pagamento';

const AppPagamento = () => {
  const [transactionAmount, setTransactionAmount] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [identificationType, setIdentificationType] = useState('');
  const [number, setNumber] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const produtosNoCarrinho = location.state?.produtos || [];

  useEffect(() => {
    const total = produtosNoCarrinho.reduce(
      (acc, produto) => acc + produto.preco * produto.quantidade, 0
    );
    setProdutos(produtosNoCarrinho);
    setTransactionAmount(total.toFixed(2));
    setDescription('Compra de produtos no nosso site');
  }, [produtosNoCarrinho]);

  const handleProcessarPagamento = async () => {
    // Validação dos dados antes de enviar o pagamento
    if (!email || !identificationType || !number) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = {
        transactionAmount,
        description,
        email,
        identificationType,
        number,
        idempotencyKey, // Idempotência para evitar pagamentos duplicados
      };

      const response = await axios.post(API_URL, data);

      if (response.data.status === 201) {
        const qrCode = response.data.body.point_of_interaction.transaction_data.qr_code;
        setQrCode(qrCode);
      } else {
        setError('Erro ao processar pagamento.');
      }
    } catch (error) {
      setError('Erro ao processar pagamento.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Pagamento via Pix</h1>
      <form>
        <label>
          Valor da transação:
          <input
            type="text"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            readOnly // O valor é calculado automaticamente
          />
        </label>
        <br />
        <label>
          Descrição da transação:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly // O valor é fixo
          />
        </label>
        <br />
        <label>
          E-mail do comprador:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Tipo de documento:
          <select
            value={identificationType}
            onChange={(e) => setIdentificationType(e.target.value)}
          >
            <option value="">Selecione um tipo de documento</option>
            <option value="CPF">CPF</option>
            <option value="RG">RG</option>
          </select>
        </label>
        <br />
        <label>
          Número do documento:
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </label>
        <br />
        <button
          type="button"
          onClick={handleProcessarPagamento}
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Processar pagamento'}
        </button>
      </form>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {qrCode && <QrCode qrCode={qrCode} />}
    </div>
  );
};

export default AppPagamento;