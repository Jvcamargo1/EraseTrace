chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "clearHistory") {
        const sitesToDelete = request.sites;
        
        if (sitesToDelete && sitesToDelete.length > 0) {
            chrome.history.search({text: '', startTime: 0, maxResults: 1000000}, function(historyItems) {
                let deletedCount = 0;
                
                historyItems.forEach(function(historyItem) {
                    if (sitesToDelete.some(site => {
                        // Remove protocol if present
                        let cleanSite = site.replace(/^https?:\/\//, '');
                        // Escape special characters for regex
                        cleanSite = cleanSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        // Create regex that matches domain and subdomains
                        const regex = new RegExp(`(^|\\.)${cleanSite}$`);
                        // Get hostname from history item URL
                        const historyHostname = new URL(historyItem.url).hostname;
                        // Test if hostname matches our regex
                        return regex.test(historyHostname);
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