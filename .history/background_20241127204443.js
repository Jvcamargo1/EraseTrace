chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "clearHistory") {
      const sitesToDelete = request.sites;
      
      if (sitesToDelete && sitesToDelete.length > 0) {
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
        sendResponse({message: "Nenhum site selecionado para apagar."});
      }
      return true; // Keeps the message channel open for the asynchronous response
    }
  });