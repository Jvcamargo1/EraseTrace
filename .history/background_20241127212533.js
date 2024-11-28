chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "clearHistory") {
      const sitesToDelete = request.sites;
      
      if (sitesToDelete && sitesToDelete.length > 0) {
        let deletedCount = 0;
        let processedCount = 0;
        
        function deleteHistoryBatch(startTime) {
          chrome.history.search({
            text: '',
            startTime: 0,
            endTime: startTime,
            maxResults: 1000
          }, function(historyItems) {
            if (historyItems.length > 0) {
              historyItems.forEach(function(historyItem) {
                if (sitesToDelete.some(site => {
                  let cleanSite = site.replace(/^https?:\/\//, '');
                  cleanSite = cleanSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  const regex = new RegExp(`(^|\\.)${cleanSite}`);
                  const historyHostname = new URL(historyItem.url).hostname;
                  return regex.test(historyHostname);
                })) {
                  chrome.history.deleteUrl({url: historyItem.url});
                  deletedCount++;
                }
                processedCount++;
              });
              
              // Continue with the next batch
              deleteHistoryBatch(historyItems[historyItems.length - 1].lastVisitTime - 1);
            } else {
              // All history items have been processed
              sendResponse({message: `${deletedCount} itens do histórico foram apagados.`});
            }
          });
        }
        
        // Start the deletion process
        deleteHistoryBatch(Date.now());
      } else {
        sendResponse({message: "Nenhum site selecionado para apagar."});
      }
      return true; // Keeps the message channel open for the asynchronous response
    }
  });