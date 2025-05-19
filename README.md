
# 🚀 K6 Performance Test - Testes de Carga e Pico

Este projeto utiliza o **K6** para realizar testes de carga e pico no site **[Blaze Demo](https://www.blazedemo.com)**, com o objetivo de garantir que o sistema suporte **250 requisições por segundo** com um **tempo de resposta 90º percentil inferior a 2 segundos**.

## 📋 Pré-Requisitos

Para rodar os testes, você precisará de:

- [K6](https://k6.io/docs/getting-started/installation) instalado em sua máquina.
- Um terminal ou prompt de comando para executar os testes.
- [Node.js](https://nodejs.org/) instalado, caso queira gerar relatórios HTML.

## 🗂 Estrutura do Projeto

- `load_test.js`: Script que contém os testes de carga e pico para o site **Blaze Demo**.
- `results/`: Diretório onde os resultados dos testes serão armazenados.
- `report/`: Relatórios gerados pelo K6 após a execução do teste.
- `README.md`: Este arquivo, que fornece a documentação detalhada do projeto.

## ⚙️ Como Rodar os Testes

### 1. Clone este repositório para o seu ambiente local:

```bash
git clone https://github.com/seu-usuario/my-k6-performance-test.git
cd my-k6-performance-test
```

### 2. Execute o teste de carga e pico:

```bash
k6 run load_test.js
```

### 3. O K6 gerará as métricas de performance diretamente no terminal, incluindo o tempo de resposta, requisições por segundo e outras informações relevantes.

## 🔧 Estrutura do Script

O script `load_test.js` é dividido em dois cenários:

### 🚀 Cenário de Carga

- **Executor**: `constant-arrival-rate`
- **Taxa de Requisições**: 250 RPS (requisições por segundo)
- **Duração**: 4 minutos
- **Usuários Virtuais**: 300 inicialmente, podendo atingir até 400

### 🌐 Cenário de Pico

- **Executor**: `ramping-arrival-rate`
- **Taxa Inicial**: 0 RPS
- **Taxa Final**: 250 RPS
- **Duração Total**: 1 minuto (dividido em 3 etapas)

### ⏱ Critérios de Aceitação

- **Taxa de Requisições**: 250 requisições por segundo.
- **Tempo de Resposta**: 90º percentil deve ser inferior a 2 segundos.

## 📊 Analisando os Resultados

Durante a execução do teste, o K6 gerou um relatório com as seguintes métricas:

### ✅ O que foi atendido:

- **Taxa de Requisições por Segundo**: O teste de carga e o teste de pico conseguiram atingir a **taxa de 250 RPS** durante a execução. 
  - Durante o **cenário de carga**, o sistema conseguiu manter uma taxa constante de **250 requisições por segundo** por 4 minutos.
  - Durante o **cenário de pico**, o sistema começou com **0 requisições por segundo**, aumentou gradualmente para **250 requisições por segundo**, e manteve essa taxa durante o pico de 30 segundos.

### ❌ O que não foi atendido:

- **Tempo de Resposta (90º Percentil)**: O critério de **90º percentil de tempo de resposta** abaixo de **2 segundos** não foi atendido. Durante a execução, o K6 indicou que a média de tempo de resposta para 90% das requisições foi **acima de 2 segundos**, resultando no erro: 
  - **"thresholds on metrics 'http_req_duration' have been crossed"**.
  
### 🧐 Explicação do Excesso de Tempo de Resposta

A razão para o tempo de resposta ter excedido **2 segundos** no **90º percentil** pode ser atribuída a vários fatores:

1. **Carga do Sistema Sob Teste**: 
   - A infraestrutura do **Blaze Demo** pode não estar otimizada para lidar com um grande número de requisições simultâneas (250 RPS), especialmente durante o pico.
   - O aumento abrupto de requisições no **teste de pico** pode ter sobrecarregado o sistema, resultando em **tempos de resposta mais longos**.
   
2. **Capacidade do Servidor e Rede**:
   - O servidor pode não ter capacidade suficiente para lidar com a quantidade de tráfego simultâneo gerado pelos 250 VUs (usuários virtuais) solicitando dados e processando a compra de passagens.
   - A **latência de rede** ou outros gargalos na infraestrutura podem ter causado **atrasos nas respostas** do servidor, aumentando o tempo de resposta.

3. **Processamento no Backend**:
   - Se o site faz operações complexas de **consultas ao banco de dados**, **validação de informações** ou outras interações com APIs externas durante o processo de compra, isso pode ter aumentado o tempo necessário para processar cada requisição.
   
4. **Escalabilidade**:
   - O teste indicou que o sistema não foi escalável o suficiente para **manter um tempo de resposta rápido** quando o número de usuários virtuais aumentou, indicando um possível problema de **escalabilidade da aplicação**.


## ⚡ Como Melhorar o Desempenho

1. **Aumentar a Capacidade do Servidor**:
   - Se possível, aumentar a capacidade de **CPU**, **memória** e **rede** do servidor onde a aplicação está hospedada.
   
2. **Otimizar o Backend**:
   - Melhorar o desempenho de qualquer processo que envolva o **banco de dados**, APIs externas ou cálculos complexos no backend.

3. **Escalabilidade Horizontal**:
   - Implementar **escala horizontal** no sistema (adicionar mais instâncias de servidores) para distribuir a carga de maneira mais eficiente.

4. **Ajustar o Critério de Aceitação**:
   - Se os requisitos de 2 segundos forem muito agressivos para o seu ambiente, você pode considerar **ajustar o critério de tempo de resposta** para ser mais realista.

## 💾 Salvando Resultados e Gerando Relatórios

### 🔄 Armazenando Resultados em Arquivo JSON

O K6 pode exportar os resultados em formato JSON usando a opção `--out` no comando. Para isso, execute:

```bash
k6 run --out json=results/result.json load_test.js
```

Isso salvará os resultados do teste no diretório `results/` como `result.json`.

### 📑 Gerando Relatórios em HTML

Caso queira gerar um relatório em HTML a partir dos resultados do K6, siga os seguintes passos:

#### 1. **Instalar o K6 Reporter (Opcional)**

```bash
npm install -g k6-reporter
```

#### 2. **Rodar o Teste e Gerar o Relatório**

Primeiro, execute o teste e salve os resultados em um arquivo JSON:

```bash
k6 run --out json=results/result.json load_test.js
```

Depois, gere o relatório HTML com o comando:

```bash
k6-reporter results/result.json report/report.html
```

Isso gerará um relatório HTML no diretório `report/` com as métricas detalhadas.
Observação: report via k6 é totalmente customizável para ser apresentado pelo grafana.

### 📂 Diretórios e Arquivos Gerados

- **`results/`**: Diretório onde o K6 armazenará os resultados do teste em formato JSON (`result.json`).
- **`report/`**: Diretório onde os relatórios gerados pelo K6 serão armazenados (por exemplo, `report.html` - Necessário Customizar para o Grafana).

## 🚀 Conclusão

O teste de carga e pico foi **bem-sucedido** em termos de requisições por segundo, atingindo **250 RPS**. No entanto, o critério de **tempo de resposta 90º percentil** foi **excedido** devido a possíveis gargalos na infraestrutura ou na escalabilidade da aplicação sob carga intensa. Para garantir que os requisitos de performance sejam atendidos, seria necessário revisar a capacidade do sistema e otimizar os componentes críticos.



