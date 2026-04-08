# 🧹 EraseTrace

> Uma extensão de navegador simples e eficiente para apagar seletivamente o histórico de navegação e os cookies dos seus sites escolhidos.

[![Versão](https://img.shields.io/badge/versão-1.0.0-blue.svg)]()
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg)]()
[![Licença](https://img.shields.io/badge/licença-MIT-green.svg)]()

O **EraseTrace** foi criado como um projeto pessoal para praticar desenvolvimento de extensões para navegadores Chromium (Chrome, Edge, Brave). Ele permite que você crie uma "lista negra" personalizada de sites cujos rastros você deseja apagar com um único clique.

##  Funcionalidades

- 📝 **Lista Personalizada:** Adicione, edite e remova facilmente os sites que você deseja monitorar.
- 🕒 **Limpeza Seletiva:** Apague do histórico de navegação apenas as entradas correspondentes aos sites da sua lista, mantendo o restante do histórico intacto.
- 🍪 **Limpeza Profunda:** Opção embutida para também remover os *cookies* associados aos sites selecionados.
- 💾 **Sincronização na Nuvem:** Sua lista de sites é salva utilizando a API `chrome.storage.sync`, permitindo que ela seja sincronizada através da sua conta Google no navegador.

##  Como Funciona

1. Abra o painel (popup) da extensão.
2. Adicione os URLs dos sites que deseja limpar (ex: `facebook.com`, `twitter.com`).
3. Marque os sites desejados na lista, marque a opção de apagar *Cookies* caso queira uma limpeza extra.
4. Clique em **"Limpar Histórico"** e veja os rastros desaparecerem!