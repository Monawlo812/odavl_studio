// EvidencePanel webview with CSP, search/filter, no jQuery/JSX
export function getHtml() {
  const nonce = Date.now().toString();
  return `<!DOCTYPE html><html><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline';">
</head><body>
<input id='search' placeholder='Search evidence...'/>
<ul id='list'></ul>
<script nonce='${nonce}'>
const vscode = acquireVsCodeApi();
window.addEventListener('message', function(e) {
  var items = e.data.items || [];
  render(items);
  document.getElementById('search').oninput = function(ev) {
    var q = ev.target.value.toLowerCase();
    render(items.filter(function(i) { return i.path && i.path.toLowerCase().indexOf(q) !== -1; }));
  };
});
function render(items) {
  var html = '';
  for (var i = 0; i < items.length; i++) {
    html += '<li>' + (items[i].path || '') + '</li>';
  }
  document.getElementById('list').innerHTML = html;
}
</script></body></html>`;
}
