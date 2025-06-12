# DispatcheurCC - Sistema Integrado de Gestão para Call Centers de Reboques

![Logo](dispatcheur.png)

## 📌 Visão Geral

O DispatcheurCC é uma solução completa para gestão operacional de empresas de reboques em regime de call center, oferecendo:

- Integração em tempo real entre call centers e equipas técnicas
- Monitorização multiplataforma via web e extensão Chrome
- Sistema VoIP avançado com suporte a 10 chamadas simultâneas
- Dashboards inteligentes por tipo de utilizador (Admin/Agente/Cliente)

## 🛠️ Funcionalidades Principais

### 🔐 Gestão de Acesso
- Autenticação JWT com três níveis de acesso
- Perfis diferenciados (Administrador, Agente, Cliente)
- Auditoria de atividades e histórico de sessões

### 📞 Operações de Call Center
- Painel VoIP multi-chamadas com transferência e hold
- Atribuição inteligente de missões por geolocalização
- Notificações em tempo real via WebSocket
- Gravação e análise de chamadas

### 🚛 Gestão de Missões
- Rastreamento GPS de técnicos em tempo real
- Sistema de priorização dinâmica de ocorrências
- Relatórios de desempenho por técnico/cliente
- Planeamento de turnos e escalas

### 📊 Business Intelligence
- Estatísticas operacionais históricas e preditivas
- Painéis personalizáveis por métrica-chave (KPIs)
- Exportação de dados para formatos analíticos (CSV/PDF)
- Integração com ferramentas de BI externas

## 🏗️ Arquitetura do Sistema
                ┌───────────────┐           ┌─────────────────┐
                │               │           │                 │
                │  Frontend     │◄─────────►│  DispatcheurCC  │
                │  React        │           │  API            │◄─────────────┐
                │               │           │                 │              │
                └───────────────┘           └─────────────────┘              │
                                                    ▲                        │
                                                    │                        │
                ┌───────────────┐                   │                        │
                │               │                   │              ┌─────────▼────────┐
                │  Extensão de  │◄──────────────────┘              │                  │
                │  Navegador    │                                  │  Banco de Dados  │
                │               │                                  │                  │
                └───────────────┘                                  └──────────────────┘

## 📚 Documentação Técnica

### Backend API
- Especificação OpenAPI 3.0 disponível em `/api-docs`
- Endpoints RESTful para todas as operações do sistema
- Middlewares de segurança e validação de dados

### Frontend React
- Componentes modulares reutilizáveis
- Context API para gestão de estado global
- Integração com Mapas e serviços de geolocalização

### Extensão Chrome
- Monitorização automática de websites-alvo
- Sincronização bidirecional com a API principal
- Sistema de notificações nativas do navegador

## ⚙️ Tecnologias Utilizadas

| Camada           | Tecnologias                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| **Frontend**      | React 19, Material UI, SIP.js, Socket.IO Client, Recharts                   |
| **Backend**       | Node.js 18, Express, JWT, PostgreSQL, Redis, SwaggerUI                     |
| **VoIP**          | SIP Protocol, WebRTC, Nuacom Gateway                                       |
| **Infraestrutura**| Docker, AWS EC2, S3, CloudFront                                            |
| **Monitorização** | Prometheus, Grafana, Sentry                                                |

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Redis 6+


