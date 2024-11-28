chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "clearHistory") {
        const sitesToDelete = request.sites;
        const deleteCookies = request.deleteCookies;
        
        if (sitesToDelete && sitesToDelete.length > 0) {
            chrome.history.search({text: '', startTime: 0, maxResults: 1000000}, function(historyItems) {
                let deletedCount = 0;
                
                historyItems.forEach(function(historyItem) {
                    if (sitesToDelete.some(site => {
                        let cleanSite = site.replace(/^https?:\/\//, '').replace(/[\/\\]+$/, '');
                        cleanSite = cleanSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(`(^|\\.)${cleanSite}$`);
                        const historyHostname = new URL(historyItem.url).hostname;
                        return regex.test(historyHostname);
                    })) {
                        chrome.history.deleteUrl({url: historyItem.url});
                        deletedCount++;

                        if (deleteCookies) {
                            const url = new URL(historyItem.url);
                            chrome.cookies.getAll({domain: url.hostname}, function(cookies) {
                                cookies.forEach(function(cookie) {
                                    chrome.cookies.remove({url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`, name: cookie.name});
                                });
                            });
                        }
                    }
                });
                
                sendResponse({message: `${deletedCount} itens do histórico foram apagados.`});
            });
        } else {
            sendResponse({message: "Nenhum site selecionado para apagar."});
        }
        return true;
    }
});