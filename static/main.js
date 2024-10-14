document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    let query = document.getElementById('query').value;
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'query': query
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayResults(data);
        displayChart(data);
    });
});

function displayResults(data) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>Results</h2>';
    for (let i = 0; i < data.documents.length; i++) {
        let docDiv = document.createElement('div');
        docDiv.innerHTML = `<strong>Document ${data.indices[i]}</strong><p>${data.documents[i]}</p><br><strong>Similarity: ${data.similarities[i]}</strong>`;
        resultsDiv.appendChild(docDiv);
    }
}

let chart = null;

function displayChart(data) {
    // Input: data (object) - contains the following keys:
    //        - documents (list) - list of documents
    //        - indices (list) - list of indices   
    //        - similarities (list) - list of similarities
    // TODO: Implement function to display chart here
    //       There is a canvas element in the HTML file with the id 'similarity-chart'
    const ctx = document.getElementById('similarity-chart').getContext('2d');

    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.indices.map(index => `Document ${index}`),
            datasets: [{
                label: 'Cosine Similarity',
                data: data.similarities,
                backgroundColor: data.similarities.map(value => {
                    if (value > 0.8) return 'rgba(75, 192, 192, 0.6)';  // Green for high similarity
                    if (value > 0.5) return 'rgba(255, 205, 86, 0.6)'; // Yellow for moderate similarity
                    return 'rgba(255, 99, 132, 0.6)'; // Red for low similarity
                }),
                borderColor: data.similarities.map(value => {
                    if (value > 0.8) return 'rgba(75, 192, 192, 1)';  // Green border
                    if (value > 0.5) return 'rgba(255, 205, 86, 1)'; // Yellow border
                    return 'rgba(255, 99, 132, 1)'; // Red border
                }),
                borderWidth: 2  // Slightly thicker border
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        color: 'black', // Black grid lines on X-axis
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 1,
                    ticks: {
                        stepSize: 0.1
                    },
                    grid: {
                        color: 'black', // Black grid lines on Y-axis
                    }
                }
            }
        }
    });
    
}