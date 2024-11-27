const root = document.getElementById('display')

const jishoButton = document.getElementById('jisho-button')


function loadData() {
    fetch('./wordsn1.json')
        .then(res => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json()
        })
        .then(data => {
            const len = data.length
            setInterval(() => {
                root.classList.add('fade-out');
                root.classList.remove('fade-in');
                const text = data[Math.round(Math.random() * len)]
                const fontSize = 29 - (text.length * 2.5)
                jishoButton.href = `https://jisho.org/search/${text}`
                
                setTimeout(() => {
                    root.innerHTML = text
                    root.style.fontSize = `${fontSize}em`
                    root.classList.remove('fade-out');
                    root.classList.add('fade-in')
                }, 1000);

                
            }, 8000);
        })
        .catch(error =>
            console.error("Unable to fetch data:", error)
        )
}

loadData()