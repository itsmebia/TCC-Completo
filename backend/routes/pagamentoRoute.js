const express = require('express');
const axios = require('axios');
const cors = require('cors');
const db = require("../config/Db");
const mercadopago = require('mercadopago');
const router = express.Router();
router.use(cors());
router.use(cors({ origin: "http://localhost:3000" }));

// Rota para calcular o frete
router.post('/calcular-frete', async (req, res) => {
  const { cepOrigem, cepDestino, peso, dimensoes } = req.body;

  try {
    const response = await axios.post('https://api.melhorenvio.com.br/v2/fretes', {
      from: {
        postal_code: cepOrigem,
      },
      to: {
        postal_code: cepDestino,
      },
      products: [
        {
          weight: peso,
          dimensions: dimensoes,
        },
      ],
    }, {
      headers: {
        Authorization: 'Bearer SEU_ACCESS_TOKEN_DO_MELHOR_ENVIO',
      },
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    res.status(500).json({ success: false, message: 'Erro ao calcular frete' });
  }
});

// Rota para processar o pagamento
//mercadopago.configurations.setAccessToken('TEST-2447061512231866-121206-03d1b602faacbebd25da2ffd3266c4a2-1550039866');

router.post('/processar-pagamento', async (req, res) => {
    try {
        const {
            transactionAmount,
            description,
            paymentMethodId,
            email,
            identificationType,
            number,
            idempotencyKey
        } = req.body;

        // Criação do pagamento com o MercadoPago
        const paymentData = {
            transaction_amount: parseFloat(transactionAmount),
            description: description,
            payment_method_id: paymentMethodId,
            payer: {
                email: email,
                identification: {
                    type: identificationType,
                    number: number
                }
            }
        };

        // Configuração de idempotência
        const requestOptions = {
            idempotencyKey: idempotencyKey
        };

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
});

// Rota para obter os métodos de pagamento
router.get('/processar-pagamento/payment-methods', async (req, res) => {
  try {
    const response = await axios.get('https://api.mercadopago.com/v1/payment_methods', {
      headers: {
        Authorization: 'Bearer TEST-2447061512231866-121206-03d1b602faacbebd25da2ffd3266c4a2-1550039866',
      },
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Erro ao obter métodos de pagamento:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter métodos de pagamento' });
  }
});

// Rota para obter os tipos de documento
router.get('/processar-pagamento/identification-types', async (req, res) => {
  try {
    const response = await axios.get('https://api.mercadopago.com/v1/identification_types', {
      headers: {
        Authorization: 'Bearer TEST-2447061512231866-121206-03d1b602faacbebd25da2ffd3266c4a2-1550039866',
      },
    });

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Erro ao obter tipos de documento:', error);
    res.status(500).json({ success: false, message: 'Erro ao obter tipos de documento' });
  }
});

module.exports = router;