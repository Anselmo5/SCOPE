# SCOPE 

O **SCOPE** é uma ferramenta de análise de websites que transforma métricas técnicas em informações práticas para melhorar a qualidade de uma página web. Utilizando a API do Google PageSpeed Insights, o projeto identifica oportunidades de melhoria em desempenho, acessibilidade, boas práticas e SEO.

Além das pontuações, o SCOPE apresenta recomendações traduzidas para português, facilitando a compreensão dos problemas identificados durante a análise.

## Funcionalidades

- **Análise de websites:** consulta dados reais por meio do Google PageSpeed Insights.
- **Quatro categorias de avaliação:** desempenho, acessibilidade, boas práticas e SEO.
- **Pontuações visuais:** apresentação dos resultados em uma escala de 0 a 100.
- **Recomendações de melhoria:** identificação e exibição de oportunidades técnicas encontradas nas auditorias.
- **Tradução para português:** utilização do Argos Translate para traduzir títulos, descrições e categorias das recomendações.
- **Tratamento de erros:** mensagens compreensíveis para falhas de análise e problemas de acesso aos sites.
- **Interface responsiva:** layout adaptável para diferentes tamanhos de tela.

## Tecnologias utilizadas

- [Next.js](https://nextjs.org/) — aplicação web e rotas de API.
- [React](https://react.dev/) — construção da interface.
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática.
- CSS Modules — estilização e organização dos estilos.
- [Google PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) — análise e auditorias de websites.
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) — tecnologia de auditoria utilizada pelo PageSpeed Insights.
- [Argos Translate](https://argosopentech.com/) — tradução local das recomendações.

## Como funciona

1. O usuário informa o endereço de um website.
2. O frontend envia uma solicitação para a API interna do SCOPE.
3. O servidor consulta o Google PageSpeed Insights.
4. Os resultados são processados e as recomendações são organizadas.
5. O serviço Argos Translate traduz os textos das recomendações para português.
6. A interface apresenta as pontuações e as oportunidades de melhoria.

## Pré-requisitos

Antes de executar o projeto, instale:

- Node.js e npm.
- Uma chave de API do Google PageSpeed Insights.
- Python e pip, para executar o serviço de tradução Argos Translate.
- Os pacotes e modelos de idioma necessários para o serviço de tradução.

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/Anselmo5/SCOPE.git
cd SCOPE
```

> Se o nome ou o endereço do repositório for diferente, ajuste a URL do comando acima.

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
PAGESPEED_API_KEY=sua_chave_da_api
```

Obtenha uma chave no [Google Cloud Console](https://console.cloud.google.com/), habilitando a API do PageSpeed Insights para o projeto correspondente.

**Importante:** não compartilhe sua chave de API nem a envie para o repositório. Mantenha o arquivo `.env.local` fora do controle de versão.

### 4. Configure o serviço de tradução

O SCOPE utiliza um serviço local de tradução compatível com o endpoint `POST /translate`, executado por padrão em:

```text
http://127.0.0.1:8000/translate
```

O serviço deve aceitar um corpo JSON com uma lista de textos:

```json
{
  "texts": [
    "Improve image delivery",
    "Avoid enormous network payloads"
  ]
}
```

E retornar as traduções no formato:

```json
{
  "translations": [
    "Melhore a entrega de imagens",
    "Evite cargas de rede muito grandes"
  ]
}
```

Configure o ambiente Python, instale as dependências do serviço Argos Translate e disponibilize os modelos de idioma necessários. Inicie o serviço antes de realizar análises no SCOPE.

> A configuração específica do servidor de tradução depende dos arquivos e das dependências utilizados no projeto.

### 5. Execute o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Configuração para produção

Antes de publicar o SCOPE:

- Configure `PAGESPEED_API_KEY` nas variáveis de ambiente da hospedagem.
- Disponibilize o serviço de tradução em um ambiente acessível pelo servidor da aplicação.
- Ajuste o endereço do serviço de tradução para o ambiente de produção, se necessário.
- Execute o build para verificar erros de compilação:

```bash
npm run build
```

- Verifique se as rotas da API funcionam no ambiente publicado.
- Não exponha chaves de API ou credenciais no código-fonte.

**Atenção:** o endereço `127.0.0.1` em produção aponta para a própria máquina que executa o servidor. Se o serviço de tradução estiver em outro ambiente, será necessário configurar seu endereço correspondente.

## Objetivo do projeto

O SCOPE foi desenvolvido como um projeto de portfólio com foco em desenvolvimento web, integração com APIs externas, processamento de dados, tradução de conteúdo e construção de interfaces responsivas.

O projeto explora a conexão entre frontend e backend, o tratamento de erros e a apresentação de informações técnicas de maneira acessível.

## Autor

**Anselmo Henrique**

Desenvolvedor Front-end Web e Mobile.

- GitHub: [@Anselmo5](https://github.com/Anselmo5)

---

*Transforme dados técnicos em melhorias reais para a web.*
