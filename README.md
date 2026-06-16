# DudsMobiRent

DudsMobiRent é um sistema de mockup de aluguel de veículos desenvolvido com HTML, CSS e JavaScript puros. Ele permite cadastro, listagem, edição e exclusão de clientes e veículos, além de contar com um dashboard que mostra estatísticas em tempo real.

## Funcionalidades

- Dashboard com contagem de clientes, veículos disponíveis e locações ativas
- Cadastro de clientes com CPF, email, telefone e endereço
- Listagem de clientes com edição e exclusão de registros
- Cadastro de veículos com marca, modelo, ano, placa, diária e status
- Listagem de veículos com edição, exclusão e status visual
- Tema escuro/claro com preferência salva no `localStorage`
- Persistência de dados local no navegador usando `localStorage`
- Interface responsiva com Bootstrap 5.3 e design customizado

## Estrutura do Projeto

- `index.html` - Página inicial com dashboard e carousel
- `clientes/clientes_cadastro.html` - Formulário de cadastro de clientes
- `clientes/clientes_lista.html` - Listagem de clientes
- `veiculos/veiculos_cadastro.html` - Formulário de cadastro de veículos
- `veiculos/veiculos_lista.html` - Listagem de veículos
- `css/style.css` - Estilo principal, paleta de cores e tema escuro/claro
- `js/script.js` - Lógica de CRUD, renderização dinâmica, tema e dashboard

## Paleta de Cores

- `#454546` - Cinza escuro
- `#666666` - Cinza médio
- `#8c8c8c` - Cinza claro
- `#ff9800` - Laranja principal
- `#ffc340` - Laranja claro

## Como Executar

1. Abra a pasta do projeto no seu editor ou gerenciador de arquivos.
2. Abra `index.html` em um navegador moderno.
3. Use o menu para navegar entre as páginas de cadastro e listagem.

> O projeto não precisa de servidor backend; todos os dados são armazenados localmente no navegador.

## Como usar

1. No dashboard, veja o total de clientes, veículos disponíveis e locações ativas.
2. Acesse `Clientes > Cadastrar Cliente` para registrar um novo cliente.
3. Acesse `Clientes > Listar Clientes` para ver, editar ou excluir clientes.
4. Acesse `Veículos > Cadastrar Veículo` para registrar um novo veículo.
5. Acesse `Veículos > Listar Veículos` para ver, editar ou excluir veículos.
6. Use o botão `Modo Escuro` para alternar entre tema claro e escuro.

## Persistência de Dados

Os dados são salvos no `localStorage` com as chaves:

- `dudsmobirent-clients`
- `dudsmobirent-vehicles`
- `dudsmobirent-theme`

## Melhorias Futuras

- Adicionar validação avançada nos formulários
- Substituir os prompts de edição por modais ou formulários de edição dedicados
- Criar backend para persistência verdadeira em banco de dados
- Implementar sistema de locação com controle de datas e preços

## Licença

Projeto de demonstração sem licença específica.
