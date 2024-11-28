document.addEventListener('DOMContentLoaded', function() {
  const sitesListTextarea = document.getElementById('sitesList');
  const saveSitesButton = document.getElementById('saveSites');
  const clearHistoryButton = document.getElementById('clearHistory');
  const statusDiv = document.getElementById('status');

  // Carregar a lista salva de sites
  chrome.storage.sync.get(['sitesToDelete'], function(result) {
    if (result.sitesToDelete) {
      sitesListTextarea.value = result.sitesToDelete.join('\n');
    }
  });

  // Salvar a lista de sites
  saveSitesButton.addEventListener('click', function() {
    const sites = sitesListTextarea.value.split('\n').filter(site => site.trim() !== '');
    chrome.storage.sync.set({sitesToDelete: sites}, function() {
      statusDiv.textContent = 'Lista salva com sucesso!';
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });

  // Apagar do histórico
  clearHistoryButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "clearHistory"}, function(response) {
      statusDiv.textContent = response.message;
      setTimeout(() => { statusDiv.textContent = ''; }, 2000);
    });
  });
});