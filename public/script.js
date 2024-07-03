document.getElementById('question-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const input = document.getElementById('question-input').value
    const resulList = document.getElementById('result-list')
    resulList.innerHTML = ''; // clears previous results

    try {
        const response = await fetch('/generate-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: input })
        })

        if (response.ok) {
            const data = await response.json()
            const questions = data.split('\n').filter(question => question.trim() !== '')

            questions.forEach(question => {
                if (/[?]$/.test(question.trim())) {
                    const li = document.createElement('li')
                    li.textContent = question
                    resulList.appendChild(li)
                }
                // without question mark 
                // const li = document.createElement('li')
                //     li.textContent = question
                //     resulList.appendChild(li)

            })
        } else {
            resulList.textContent = 'Error generating questions'
        }
    } catch (error) {
        console.log(error)
    }
})