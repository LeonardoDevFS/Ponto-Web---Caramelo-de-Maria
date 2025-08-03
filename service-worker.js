// Define um nome e versão para o nosso cache de arquivos.
const CACHE_NAME = 'ponto-caramelo-v1';

// Lista de arquivos essenciais para o aplicativo funcionar offline.
const URLS_TO_CACHE = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'https://placehold.co/150x150/FFF8E1/4E342E?text=Caramelo%5Cnde+Maria'
];

// Evento 'install': é disparado quando o Service Worker é instalado pela primeira vez.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  // Espera até que o cache seja aberto e todos os arquivos essenciais sejam armazenados.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto, adicionando arquivos essenciais.');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: Todos os arquivos foram cacheados com sucesso.');
        return self.skipWaiting();
      })
  );
});

// Evento 'fetch': é disparado toda vez que o site tenta buscar um arquivo (uma imagem, o css, etc).
self.addEventListener('fetch', (event) => {
  // Responde à requisição com uma estratégia "cache-first" (primeiro tenta o cache).
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se a resposta for encontrada no cache, retorna ela. Se não, busca na rede.
        return response || fetch(event.request);
      })
  );
});

// Evento 'activate': é disparado quando o Service Worker é ativado.
// Útil para limpar caches antigos de versões anteriores.
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Ativado.');
    event.waitUntil(self.clients.claim());
});
