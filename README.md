# 🛍️ E-Commerce Serverless Simples (MVP)

Este projeto serve como referência para o estudo de desenvolvimento backend com AWS Lambda e TypeScript, focado na implementação rápida de um Mínimo Produto Viável (MVP) de um sistema de e-commerce.

O objetivo é cobrir a lógica de negócio essencial (Catálogo e Checkout) em aproximadamente 4 horas de programação.

## 🚀 Arquitetura e Tecnologias

A arquitetura escolhida segue o padrão Serverless para otimizar o tempo de desenvolvimento e o custo de execução.

| Componente | Função | Linguagem |
|------------|--------|-----------|
| Computação | AWS Lambda | TypeScript (Node.js) |
| API | AWS API Gateway (HTTP API) | Roteamento e Acesso Público |
| Banco de Dados | Amazon DynamoDB | Persistência NoSQL (Alta performance) |
| Infra. Code | Serverless Framework | Implantação e Gerenciamento |

## 💾 Modelo de Dados (Entidades Principais)

Para manter o projeto simples e dentro do prazo, focaremos em apenas duas entidades principais: **Produto** e **Pedido**.

### 1. Entidade: Product (Produto)

Representa um item no catálogo.

```typescript
interface Product {
  id: string;             // UUID único do produto
  createdAt: Date         // Data da criação
  updatedAt: Date         // Data da criação
  name: string;           // Nome do produto
  description: string;    // Descrição detalhada
  price: number;          // Preço de venda (centavos)
  unitsAvailable: number  // Quantidade em estoque disponível.
  unitsReserved: number   // Quantidade reservados por pedidos aguardando pagamento.
  imagesUrl: string[];    // URL para a imagem do produto
}
```

### 2. Entidade: Order (Pedido)

Representa uma transação de compra. Para agilizar o desenvolvimento, não teremos a entidade "Carrinho". O cliente enviará os itens diretamente para a rota de checkout.

```typescript
interface Order {
  id: string;
  createdAt: Date      // Data da criação
  updatedAt: Date      // Data da criação
  buyerId: string;      // ID do usuário que fez o pedido (assumido como autenticado)
  totalAmount: number; // O valor total do pedido, calculado no Backend
  status: 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'CANCELED'; // Status atual do pedido
  items: OrderItem[];  // Lista de produtos comprados
}

// Objeto aninhado dentro da Order:
interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;   // Preço do produto no momento da compra (congelado)
}
```

## 🗺️ Especificação das Rotas da API

A API é dividida em dois contextos de negócio principais: **Catálogo** (Leitura) e **Pedidos** (Transação/Escrita).

### A. Contexto: Catálogo de Produtos

Rotas para consulta pública dos itens à venda.

| Verbo HTTP | Rota | Descrição | Lambda Handler |
|------------|------|-----------|----------------|
| GET | `/products` | Retorna a lista de todos os produtos no catálogo. | `listProducts` |
| GET | `/products/{id}` | Retorna os detalhes de um produto específico. | `getProductById` |

### B. Contexto: Checkout e Pedidos

Rotas para criação e consulta de transações de compra.

| Verbo HTTP | Rota | Descrição | Lambda Handler |
|------------|------|-----------|----------------|
| POST | `/orders` | Cria um novo pedido (Checkout). Recebe o array de itens do cliente, calcula o valor final, e salva a transação. | `createOrder` |
| GET | `/orders` | Lista todos os pedidos feitos pelo usuário atual (filtrado por userId). | `listOrders` |
| GET | `/orders/{id}` | Retorna os detalhes de um pedido específico. | `getOrderById` |
