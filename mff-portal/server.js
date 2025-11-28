const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// --- PROXY DAS CÂMERAS ---
// Captura qualquer pedido que comece com /camera-feed
app.use('/camera-feed', createProxyMiddleware({
    // Servidor real das câmeras (HTTP)
    target: 'http://andromeda.lasdpc.icmc.usp.br:60119', 
    changeOrigin: true,
    pathRewrite: {
        // Remove '/camera-feed' e coloca '/api/stream' que é o caminho real
        '^/camera-feed': '/api/stream', 
    },
    onProxyRes: function (proxyRes, req, res) {
        // Headers vitais para stream de vídeo não travar
        proxyRes.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }
}));

// --- SERVIR O SITE ANGULAR ---
// Serve a pasta onde o 'ng build' gera os arquivos
// ATENÇÃO: Confirme se a pasta 'browser' existe dentro de 'dist/museu-flora'
app.use(express.static(path.join(__dirname, 'dist/museu-flora/browser')));

// Qualquer outra rota (ex: /fauna, /historia) devolve o index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/museu-flora/browser/index.html'));
});

// Porta onde seu site vai rodar
const PORT = process.env.PORT || 64200; 
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando! Acesse: http://seu-ip-da-vm:${PORT}`);
    console.log(`📷 Proxy de câmeras ativo em /camera-feed`);
});