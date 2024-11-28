chrome.runtime.onInstalled.addListener(() => {
    console.log("EraseTrace extension installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "clearHistory") {
        const sites = request.sites;
        const deleteCookies = request.deleteCookies;

        sites.forEach(site => {
            // Limpar histórico de navegação
            chrome.history.deleteUrl({ url: site });

            // Opcional: Limpar cookies
            if (deleteCookies) {
                const url = new URL(site);
                chrome.cookies.getAll({ domain: url.hostname }, (cookies) => {
                    cookies.forEach(cookie => {
                        chrome.cookies.remove({
                            url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`,
                            name: cookie.name
                        });
                    });
                });
            }
        });

        sendResponse({ message: "Histórico e cookies apagados com sucesso!" });
    }
    return true; // Indica que a resposta será enviada de forma assíncrona
});