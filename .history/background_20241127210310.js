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