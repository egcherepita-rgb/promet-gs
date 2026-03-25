(function(){
  const batchScopePattern = /(^|\s)(Партия|партия|шт\.?)(\s|$)/;
  const badgePattern = /^(Цвет|Размер|Материал|Длина|Лого)(\s*[:\-])\s*(.*)$/i;
  const esc = (s)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const isProductionScope = (block)=>{
    const td = block.closest('td');
    if (td && td.cellIndex === 4) return true;
    const section = block.closest('.accSection');
    const label = section?.querySelector('.accLabel')?.textContent || '';
    return /Производственные возможности/i.test(label);
  };
  document.querySelectorAll('.production-table-panel .pre').forEach((block)=>{
    const raw = block.textContent.replace(/\r/g, '');
    const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);
    if (!lines.length) return;
    const scopeText = block.closest('td, .accSection')?.textContent || '';
    const isBatch = !!block.closest('td.batch, .accBatch') || batchScopePattern.test(scopeText);
    const prodScope = !isBatch && isProductionScope(block);
    const html = lines.map((line)=>{
      const m = line.match(badgePattern);
      if (prodScope && m) {
        const label = esc(m[1]);
        const value = esc(m[3]);
        return `<span class="table-line with-badge"><span class="table-badge"><span class="table-badge-label">${label}</span></span>${value}</span>`;
      }
      if (isBatch) {
        return `<span class="table-batch-line">${esc(line)}</span>`;
      }
      return `<span class="table-line">${esc(line)}</span>`;
    }).join('');
    block.innerHTML = html;
  });
})();
