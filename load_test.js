
import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  scenarios: {
    carga: {
      executor: 'constant-arrival-rate',
      rate: 250, // 250 requisições por segundo
      timeUnit: '1s',
      duration: '4m', // Duração de 4 minutos
      preAllocatedVUs: 300, // Usuários virtuais alocados inicialmente
      maxVUs: 400, // Máximo de 400 usuários virtuais
    },
    pico: {
      executor: 'ramping-arrival-rate',
      startRate: 0, // Começa com 0 requisições por segundo
      timeUnit: '1s',
      preAllocatedVUs: 400,
      maxVUs: 500,
      stages: [
        { target: 250, duration: '15s' }, // Aumenta para 250 requisições/s por 15 segundos
        { target: 250, duration: '30s' }, // Mantém 250 requisições/s por 30 segundos
        { target: 0, duration: '15s' }, // Diminui para 0 requisições/s por 15 segundos
      ],
    },
  },
  thresholds: {
    'http_req_duration': ['p(90)<2000'], // 90% das requisições devem ter tempo de resposta < 2 segundos
  },
};

export default function () {
  // Acessando a página inicial do site
  let res = http.get('https://www.blazedemo.com/');
  check(res, {
    'Página carregada com sucesso': (r) => r.status === 200,
  });

  // Selecionando cidade de origem e destino
  let formData = {
    fromPort: 'Paris',
    toPort: 'London',
  };
  res = http.post('https://www.blazedemo.com/reserve.php', formData);
  check(res, {
    'Seleção de voo bem-sucedida': (r) => r.status === 200,
  });

  // Confirmando compra da passagem
  formData = {
    flight: '3', // Alterar conforme o voo desejado
    name: 'Fredi Roldan',
    address: '123 Rua Teste',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '12345',
    cardType: 'Visa',
    cardNumber: '4111111111111111',
    cardExpiration: '12/23',
    nameOnCard: 'Fredi Roldan',
  };
  res = http.post('https://www.blazedemo.com/confirmation.php', formData);
  check(res, {
    'Compra realizada com sucesso': (r) => r.status === 200,
  });

  sleep(1); // Intervalo entre as requisições
}
