# Ponto Web - Caramelo de Maria

## 📖 Sobre o Projeto

**Ponto Web - Caramelo de Maria** é um sistema de controle de ponto simples, moderno e eficaz, desenvolvido para atender às necessidades de duas funcionárias. O sistema utiliza a geolocalização do navegador para garantir que o ponto só possa ser registrado no local de trabalho.

O projeto foi construído para ser de baixo custo, utilizando a infraestrutura gratuita do **Google Sheets** e **Google Apps Script** como backend, e pode ser instalado como um aplicativo de celular (PWA) para acesso rápido e fácil.

---

## ✨ Funcionalidades Principais

* **✅ Ponto com Geolocalização:** O sistema só permite o registro de entrada ou saída se a funcionária estiver dentro de um raio de 30 metros do endereço da empresa.
* **🔒 Validação Anti-Duplicidade:** Impede que uma funcionária registre duas "Entradas" ou duas "Saídas" consecutivas, evitando erros.
* **📊 Relatório Financeiro Automático:** Uma aba na planilha calcula automaticamente o total de horas trabalhadas e o valor a ser pago, com base em um valor de R$ 10,00 por hora.
* **📲 Relatório e Histórico no Site:** A funcionária pode consultar seu resumo financeiro e um histórico de seus últimos 10 registros de ponto diretamente no site.
* **🟢 Indicador de Status Online:** Um indicador visual mostra se a funcionária está "Trabalhando" (Entrada) ou "Fora de serviço" (Saída).
* **📱 Experiência de Aplicativo (PWA):** O site pode ser "instalado" na tela inicial de celulares Android e iOS, funcionando como um aplicativo nativo para acesso rápido.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * HTML5
    * CSS3
    * [Tailwind CSS](https://tailwindcss.com/)
    * JavaScript (Vanilla JS)
* **Backend (Serverless):**
    * [Google Sheets](https://www.google.com/sheets/about/) (usado como banco de dados)
    * [Google Apps Script](https://developers.google.com/apps-script) (usado como a API do servidor)

---

## 📂 Estrutura do Projeto

```
/Ponto-Web---Caramelo-de-Maria
│
├── 📄 index.html         # Estrutura principal da página
├── 📄 style.css          # Estilos personalizados
├── 📄 script.js          # Lógica do site (geolocalização, chamadas para a API, etc.)
├── 📄 manifest.json      # "RG" do aplicativo para a funcionalidade PWA
├── 📄 service-worker.js  # "Cérebro offline" do PWA
└── 📄 README.md          # Este arquivo
```

---

## 🚀 Configuração e Instalação

Para colocar o sistema no ar, siga estes três passos:

### Parte 1: Configurar a Planilha Google

1.  **Crie a Planilha:** Acesse [sheets.google.com](https://sheets.google.com) e crie uma nova planilha. Dê a ela o nome de `Controle de Ponto - Caramelo de Maria`.
2.  **Crie a Aba de Registros:** A primeira aba já vem como `Página1`. Garanta que ela tenha os seguintes cabeçalhos na primeira linha:
    * `A1`: `Timestamp`
    * `B1`: `Nome`
    * `C1`: `Acao`
    * `D1`: `Horario`
3.  **Crie a Aba de Relatório:** Adicione uma nova aba clicando no `+` e renomeie-a para `Relatório`. Configure os cabeçalhos:
    * `A1`: `Funcionária`
    * `B1`: `Total de Horas`
    * `C1`: `Horas (Decimal)`
    * `D1`: `Valor a Pagar (R$)`
4.  **Adicione os Nomes:** Em `A2` e `A3`, escreva `BEATRIZ` e `CAROLINA`.
5.  **Insira as Fórmulas:**
    * Na célula **B2** (Total de Horas da Beatriz), cole:
        ```excel
        =SUMIFS(Página1!A:A; Página1!B:B; A2; Página1!C:C; "Saída") - SUMIFS(Página1!A:A; Página1!B:B; A2; Página1!C:C; "Entrada")
        ```
        Depois, formate a célula como **Duração** (`Formatar > Número > Duração`).
    * Na célula **C2** (Horas Decimais), cole: `=B2*24`. Formate como **Número**.
    * Na célula **D2** (Valor a Pagar), cole: `=C2*10`. Formate como **Moeda**.
6.  **Arraste as Fórmulas:** Selecione as células `B2`, `C2` e `D2` e arraste o pequeno quadrado azul no canto para baixo para aplicar as fórmulas à linha da Carolina.

### Parte 2: Configurar o Google Apps Script

1.  **Abra o Editor:** Na sua planilha, vá em `Extensões > Apps Script`.
2.  **Cole o Código:** Apague todo o conteúdo e cole o código do backend que está no repositório.
3.  **Implante o Script:**
    * Clique em `Implantar > Nova implantação`.
    * Selecione o tipo **"App da Web"**.
    * Em "Quem pode acessar", selecione **"Qualquer pessoa"**.
    * Clique em `Implantar` e autorize o acesso quando solicitado.
    * **Copie a URL do App da Web gerada.** Ela será sua `SCRIPT_URL`.

### Parte 3: Configurar o Site

1.  **Abra o arquivo `script.js`**.
2.  Encontre a linha: `const SCRIPT_URL = '...';`
3.  **Cole a URL** que você copiou do Google Apps Script entre as aspas.
4.  (Opcional) Se precisar testar de um local diferente, altere as coordenadas na constante `LOCAL_PERMITIDO`.

---

## 💻 Hospedagem

Para que a funcionalidade de PWA ("instalar o aplicativo") funcione, você precisa hospedar os arquivos do site em um servidor com **HTTPS**.

1.  **Crie um repositório no GitHub** com todos os 5 arquivos do projeto.
2.  **Use um serviço de hospedagem gratuito:**
    * [**Netlify**](https://www.netlify.com/): Permite arrastar e soltar a pasta do projeto para publicar.
    * [**Vercel**](https://vercel.com/): Ótima integração com o GitHub.
    * [**GitHub Pages**](https://pages.github.com/): Publica o site diretamente do seu repositório.

Após a hospedagem, acesse o link gerado pelo serviço no navegador do celular para ver a opção "Adicionar à tela inicial".

---

## 👤 Autor

**Leonardo Jonathan do Carmo**

* GitHub: `[linkedin.com/in/leonardo2002/]`
* LinkedIn: `[https://www.linkedin.com/in/leonardo2002/]`
