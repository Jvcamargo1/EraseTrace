chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "clearHistory") {
      const sitesToDelete = request.sites;
      
      if (sitesToDelete && sitesToDelete.length > 0) {
        chrome.history.search({text: '', maxResults: 1000000}, function(historyItems) {
          let deletedCount = 0;
          
          historyItems.forEach(function(historyItem) {
            if (sitesToDelete.some(site => {
              // Create a URL object for both the history item and the site to delete
              const historyUrl = new URL(historyItem.url);
              let siteUrl;
              try {
                siteUrl = new URL(site.startsWith('http') ? site : 'http://' + site);
              } catch (e) {
                // If the site is not a valid URL, just use it as is
                return historyItem.url.includes(site);
              }
              // Compare the hostname (domain) parts
              return historyUrl.hostname.endsWith(siteUrl.hostname);
            })) {
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