# Backlog de Melhorias Frontend

## Alta Prioridade

- [x] **Rebrand para AgnoLead + Redesign Login** — novos logos SVG, branding config, i18n, login page com estética macOS (glassmorphism, gradientes, dark mode)
- [ ] **Refatorar ChatList.vue** — componente ~200 linhas, dividir em: `useVirtualChatList` composable, `useChatListFilters` composable, `FilterPanel` subcomponent
- [ ] **Reduzir complexidade do Message.vue** — separar bubble variants em arquivos dedicados, message provider extraction, status indicator component
- [ ] **Melhorias de acessibilidade** — mais aria-labels explícitos, documentação de navegação por teclado, suite de testes para screen readers

## Média Prioridade

- [ ] **Audit de consistência do dark mode** — alguns componentes têm dark mode, outros não; auditar todos e considerar CSS custom properties
- [ ] **Reduzir tamanho de componentes grandes** — Sidebar, Message, ConversationCard >300 linhas; arquitetura modular
- [ ] **Expandir loading states** — mais skeleton loaders, shimmer effects, progressive enhancement

## Baixa Prioridade

- [ ] **Resolver TODO comments** — 5 TODOs encontrados no codebase
- [ ] **Aumentar cobertura Storybook** — atualmente 90 stories / 389 componentes (~23%)
- [ ] **Validar testes RTL** — suporte existe mas precisa validação completa
- [ ] **Implementar testes E2E** — visual regression testing
