document.addEventListener('DOMContentLoaded', function() {
    const sitesListDiv = document.getElementById('sitesList');
    const newSiteInput = document.getElementById('newSite');
    const addSiteButton = document.getElementById('addSite');
    const clearHistoryButton = document.getElementById('clearHistory');
    const statusDiv = document.getElementById('status');
  
    function updateSitesList() {
      chrome.storage.sync.get(['sitesToDelete'], function(result) {
        sitesListDiv.innerHTML = '';
        if (result.sitesToDelete && result.sitesToDelete.length > 0) {
          result.sitesToDelete.forEach((site, index) => {
            const siteItem = document.createElement('div');
            siteItem.className = 'site-item';
            siteItem.innerHTML = `
              <input type="checkbox" id="site${index}" checked>
              <label for="site${index}">${site}</label>
              <button class="secret-button">Editar</button>
            `;
            sitesListDiv.appendChild(siteItem);
  
            const secretButton = siteItem.querySelector('.secret-button');
            secretButton.addEventListener('click', function() {
              const newSite = prompt('Editar ou apagar o site:', site);
              if (newSite === null) {
                return; // User cancelled the prompt
              } else if (newSite === '') {
                // User wants to delete the site
                result.sitesToDelete.splice(index, 1);
              } else {
                // User wants to edit the site
                result.sitesToDelete[index] = newSite;
              }
              chrome.storage.sync.set({sitesToDelete: result.sitesToDelete}, function() {
                updateSitesList();
                statusDiv.textContent = 'Lista atualizada com sucesso!';
                setTimeout(() => { statusDiv.textContent = ''; }, 2000);
              });
            });
          });
        } else {
          sitesListDiv.textContent = 'Nenhum site na lista.';
        }
      });
    }
  
    updateSitesList();
  
    addSiteButton.addEventListener('click', function() {
      const newSite = newSiteInput.value.trim();
      if (newSite) {
        chrome.storage.sync.get(['sitesToDelete'], function(result) {
          const sites = result.sitesToDelete || [];
          if (!sites.includes(newSite)) {
            sites.push(newSite);
            chrome.storage.sync.set({sitesToDelete: sites}, function() {
              newSiteInput.value = '';
              updateSitesList();
              statusDiv.textContent = 'Site adicionado com sucesso!';
              setTimeout(() => { statusDiv.textContent = ''; }, 2000);
            });
          } else {
            statusDiv.textContent = 'Este site já está na lista.';
            setTimeout(() => { statusDiv.textContent = ''; }, 2000);
          }
        });
      }
    });
  
    clearHistoryButton.addEventListener('click', function() {
        const checkedSites = Array.from(sitesListDiv.querySelectorAll('input[type="checkbox"]:checked'))
          .map(checkbox => checkbox.nextElementSibling.textContent);
      
        if (checkedSites.length > 0) {
          chrome.runtime.sendMessage({action: "clearHistory", sites: checkedSites}, function(response) {
            if (response && response.message) {
              statusDiv.textContent = response.message;
            } else {
              statusDiv.textContent = "Erro ao limpar o histórico.";
            }
            setTimeout(() => { statusDiv.textContent = ''; }, 5000);
          });
        } else {
          statusDiv.textContent = "Nenhum site selecionado para apagar.";
          setTimeout(() => { statusDiv.textContent = ''; }, 5000);
        }
      });

