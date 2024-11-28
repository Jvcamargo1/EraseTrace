chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "clearHistory") {
    chrome.storage.sync.get(['sitesToDelete'], function(result) {
      if (result.sitesToDelete && result.sitesToDelete.length > 0) {
        const sitesToDelete = result.sitesToDelete;
        
        chrome.history.search({text: '', maxResults: 1000000}, function(historyItems) {
          let deletedCount = 0;
          
          historyItems.forEach(function(historyItem) {
            if (sitesToDelete.some(site => historyItem.url.includes(site))) {
              chrome.history.deleteUrl({url: historyItem.url});
              deletedCount++;
            }
          });
          
          sendResponse({message: `${deletedCount} itens do histórico foram apagados.`});
        });
      } else {
        sendResponse({message: "Nenhum site para apagar. Por favor, adicione sites à lista."});
      }
    });
    return true; // Keeps the message channel open for the asynchronous response
  }
});