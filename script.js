const kanji = document.getElementById('kanji')
const display = document.getElementById('display')
const jishoButton = document.getElementById('jisho-button')
const furigana = document.getElementById('furigana')
const details = document.getElementById('details')

const mapMeaning = meaning => {
    const ol = document.createElement('ol');
    ol.classList.add('list-decimal')
    ol.classList.add('marker:text-battery-charged-blue')
    meaning = meaning.slice(0,3)
    meaning.forEach(sense => {
        const li = document.createElement('li');
        li.textContent = sense.slice(0,3).join('; ');
        ol.appendChild(li);
    })
    return ol.outerHTML
}

function loadData() {
    fetch('./n1.json')
        .then(res => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json()
        })
        .then(data => {
            const len = data.length

            function changeKanji() {
                display.classList.add('opacity-0');
                display.classList.remove('opacity-100');
                const word = data[Math.floor(Math.random() * len)]
                const text = word['word']
                const furi_text = word['reading']
                const meaning = word['senses']

                const meaningHTML = mapMeaning(meaning);

                const fontSize = 25 - (text.length * 2.5)
                jishoButton.href = `https://jisho.org/search/${text}`

                setTimeout(() => {
                    kanji.style.fontSize = `${fontSize}em`
                    kanji.innerHTML = text
                    furigana.innerHTML = furi_text
                    details.innerHTML = meaningHTML
                    display.classList.remove('opacity-0');
                    display.classList.add('opacity-100')

                    setTimeout(() => changeKanji(), 9000);
                }, 1000);
            }
            changeKanji();
        })
        .catch(error =>
            console.error("Unable to fetch data:", error)
        )
}

loadData();
