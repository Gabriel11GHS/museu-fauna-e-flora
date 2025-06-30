// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',      // já deixava assim
    port: 4200,           // a porta interna do container
    strictPort: true,     // falha se outro processo já usar 4200

    // Aqui você autoriza EXATAMENTE os hosts que vai usar:
    allowedHosts: [
      'andromeda.lasdpc.icmc.usp.br',      // acesso interno sem redirecionamento de porta
      'andromeda.lasdpc.icmc.usp.br:64200'  // acesso externo que o prof faz
    ]

    // Se preferir liberar QUALQUER host, basta usar:
    // allowedHosts: ['*']
  }
})

