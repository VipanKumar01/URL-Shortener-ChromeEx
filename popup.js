document.addEventListener('DOMContentLoaded', function () {
    const shortenButton = document.getElementById('shortenUrl');
    const shortUrlDiv = document.getElementById('shortUrl');
    const loader = document.getElementById('loader');

    shortenButton.addEventListener('click', shortenUrl);
    shortUrlDiv.addEventListener('click', copyToClipboard);

    function shortenUrl() {
        loader.classList.remove('hidden');
        shortUrlDiv.classList.add('hidden');
        shortenButton.disabled = true;

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            const longUrl = currentTab.url;

            fetch('https://url-shortener-backend-jxxl.onrender.com/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ longUrl }),
            })
                .then(response => response.json())
                .then(data => {
                    loader.classList.add('hidden');
                    displayShortUrl(data.shortUrl);
                })
                .catch(error => {
                    console.error('Error:', error);
                    displayError('Could not shorten URL');
                });
        });
    }

    function displayShortUrl(url) {
        shortUrlDiv.textContent = url;
        shortUrlDiv.style.opacity = '0';
        shortUrlDiv.classList.remove('hidden');
        setTimeout(() => {
            shortUrlDiv.style.opacity = '1';
        }, 50);
        shortenButton.innerHTML = '<i class="fas fa-redo icon"></i>Shorten Another';
        shortenButton.disabled = false;
    }

    function displayError(message) {
        shortUrlDiv.textContent = `Error: ${message}`;
        shortUrlDiv.style.opacity = '0';
        shortUrlDiv.classList.remove('hidden');
        setTimeout(() => {
            shortUrlDiv.style.opacity = '1';
        }, 50);
        shortenButton.disabled = false;
    }

    function copyToClipboard() {
        const textToCopy = shortUrlDiv.textContent;
        navigator.clipboard.writeText(textToCopy).then(function () {
            showTooltip('Copied!');
        }, function (err) {
            console.error('Could not copy text: ', err);
            showTooltip('Failed to copy');
        });
    }

    function showTooltip(message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        shortUrlDiv.appendChild(tooltip);

        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 2000);
    }
});