const YAML = require('yaml');

module.exports = (output) => {
  try {
    const documentos = YAML.parseAllDocuments(output);
    if (documentos.length !== 2 || documentos.some(d => d.errors.length)) return false;
    const politicas = documentos.map(d => d.toJS());
    if (new Set(politicas.map(p => p.metadata?.name)).size !== 2) return false;
    if (politicas.some(p => p.apiVersion !== 'networking.k8s.io/v1' ||
      p.kind !== 'NetworkPolicy' || typeof p.metadata?.name !== 'string' || !p.metadata.name.trim() ||
      !p.spec?.podSelector || typeof p.spec.podSelector !== 'object' || Array.isArray(p.spec.podSelector) ||
      p.metadata?.namespace !== 'sentinel-prod' ||
      !['Ingress', 'Egress'].every(t => p.spec?.policyTypes?.includes(t)))) return false;
    const bloqueio = politicas.find(p => Object.keys(p.spec.podSelector).length === 0);
    if (!bloqueio || !Array.isArray(bloqueio.spec.ingress) || bloqueio.spec.ingress.length ||
      !Array.isArray(bloqueio.spec.egress) || bloqueio.spec.egress.length) return false;
    const liberacao = politicas.find(p => p !== bloqueio);
    if (liberacao.metadata.name !== 'sentinel-allow' ||
      JSON.stringify(liberacao.spec.podSelector) !== JSON.stringify({matchLabels: {app: 'sentinel'}})) return false;
    const permitidos = {
      ingress: ['relay-prod/app=relay', 'edge/app=api-gateway'],
      egress: ['forge-prod/app=forge:TCP/5432', 'cerebro-prod/app=cerebro:TCP/9200',
        'kube-system/k8s-app=kube-dns:TCP/53', 'kube-system/k8s-app=kube-dns:UDP/53'],
    };
    const doc = documentos[politicas.indexOf(liberacao)];
    for (const direcao of ['ingress', 'egress']) {
      const regras = liberacao.spec[direcao];
      const sequencia = doc.getIn(['spec', direcao], true);
      const nos = sequencia?.items;
      if (!Array.isArray(regras) || !regras.length || !nos) return false;
      const encontrados = [];
      for (const [i, regra] of regras.entries()) {
        // Exige comentário no item ou em seus campos, não apenas no cabeçalho do YAML.
        // O YAML associa o comentário anterior à primeira regra à sequência.
        let comentada = i === 0 && Boolean(sequencia.commentBefore);
        YAML.visit(nos[i], {Node(_, no) { if (no.comment || no.commentBefore) comentada = true; }});
        if (nos[i].comment || nos[i].commentBefore) comentada = true;
        if (!comentada) return false;
        const peers = regra[direcao === 'ingress' ? 'from' : 'to'];
        if (!Array.isArray(peers) || !peers.length) return false;
        if (direcao === 'egress' && (!Array.isArray(regra.ports) || !regra.ports.length)) return false;
        for (const peer of peers) {
          const ns = peer.namespaceSelector?.matchLabels;
          const labels = peer.podSelector?.matchLabels;
          if (!ns || Object.keys(ns).length !== 1 || !ns['kubernetes.io/metadata.name'] ||
            !labels || Object.keys(labels).length !== 1 || peer.ipBlock ||
            peer.namespaceSelector.matchExpressions || peer.podSelector.matchExpressions) return false;
          const origem = ns['kubernetes.io/metadata.name'] + '/' + Object.entries(labels)[0].join('=');
          if (direcao === 'ingress') encontrados.push(origem);
          else for (const porta of regra.ports) {
            if (porta.endPort) return false;
            encontrados.push(origem + ':' + (porta.protocol || 'TCP') + '/' + porta.port);
          }
        }
      }
      if (JSON.stringify([...new Set(encontrados)].sort()) !== JSON.stringify(permitidos[direcao].sort())) return false;
    }
    return true;
  } catch { return false; }
};
