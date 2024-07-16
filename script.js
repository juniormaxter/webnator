document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o Google Maps
    function initMap() {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -23.55052, lng: -46.633308 },
            zoom: 12
        });
    }

    // Carrega o mapa
    window.initMap = initMap;

    // Lógica de busca
    document.getElementById('search-btn').addEventListener('click', function() {
        const query = document.getElementById('search').value.toLowerCase();
        fetch(`http://localhost:3000/api/fornecedores?query=${query}`)
            .then(response => response.json())
            .then(resultados => {
                alert('Fornecedores encontrados: ' + resultados.map(f => f.nome).join(', '));
            })
            .catch(error => console.error('Erro ao buscar fornecedores:', error));
    });

    // Lógica de login
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario: username, senha: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.assinatura !== undefined) {
                alert(data.mensagem);
                if (data.assinatura) {
                    alert('Acesso completo aos fornecedores.');
                } else {
                    alert('Acesso limitado. Assine para ter acesso completo.');
                }
            } else {
                alert(data.mensagem);
            }
        })
        .catch(error => console.error('Erro ao fazer login:', error));
    });

    // Lógica de cadastro de fornecedores
    document.getElementById('signup-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('supplier-name').value;
        const address = document.getElementById('address').value;
        fetch('http://localhost:3000/api/fornecedores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: name, endereco: address })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensagem);
        })
        .catch(error => console.error('Erro ao cadastrar fornecedor:', error));
    });
});
