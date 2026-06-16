const CLIENTS_KEY = 'dudsmobirent-clients';
const VEHICLES_KEY = 'dudsmobirent-vehicles';
const THEME_KEY = 'dudsmobirent-theme';

function getStorageData(key) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function setStorageData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
        themeToggleBtn.classList.toggle('btn-outline-light', theme === 'dark');
        themeToggleBtn.classList.toggle('btn-outline-dark', theme === 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function renderClientsTable() {
    const tableBody = document.getElementById('clientsTableBody');
    if (!tableBody) return;

    const clients = getStorageData(CLIENTS_KEY);
    tableBody.innerHTML = '';

    if (!clients.length) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-light-gray py-4">Nenhum cliente cadastrado ainda.</td></tr>';
        return;
    }

    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.cpf}</td>
            <td>${client.email}</td>
            <td>${client.telefone}</td>
            <td>${client.endereco}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editClient(${client.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteClient(${client.id})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderVehiclesTable() {
    const tableBody = document.getElementById('vehiclesTableBody');
    if (!tableBody) return;

    const vehicles = getStorageData(VEHICLES_KEY);
    tableBody.innerHTML = '';

    if (!vehicles.length) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-light-gray py-4">Nenhum veículo cadastrado ainda.</td></tr>';
        return;
    }

    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        const badgeStatus = vehicle.status === 'Alugado' ? 'badge-rented' : 'badge-available';
        row.innerHTML = `
            <td>${vehicle.marca}</td>
            <td>${vehicle.modelo}</td>
            <td>${vehicle.ano}</td>
            <td>${vehicle.placa}</td>
            <td>${formatCurrency(vehicle.diaria)}</td>
            <td><span class="badge badge-status ${badgeStatus}">${vehicle.status}</span></td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editVehicle(${vehicle.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${vehicle.id})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateDashboardCards() {
    const totalClientsCount = document.getElementById('totalClientsCount');
    const availableVehiclesCount = document.getElementById('availableVehiclesCount');
    const activeRentalsCount = document.getElementById('activeRentalsCount');
    const clientsSummaryText = document.getElementById('clientsSummaryText');
    const vehiclesSummaryText = document.getElementById('vehiclesSummaryText');
    const rentalsSummaryText = document.getElementById('rentalsSummaryText');

    const clients = getStorageData(CLIENTS_KEY);
    const vehicles = getStorageData(VEHICLES_KEY);
    const vehiclesAvailable = vehicles.filter(v => v.status === 'Disponível').length;
    const vehiclesRented = vehicles.filter(v => v.status === 'Alugado').length;

    if (totalClientsCount) totalClientsCount.textContent = clients.length;
    if (availableVehiclesCount) availableVehiclesCount.textContent = vehiclesAvailable;
    if (activeRentalsCount) activeRentalsCount.textContent = vehiclesRented;

    if (clientsSummaryText) {
        clientsSummaryText.textContent = clients.length
            ? `${clients.length} cliente${clients.length > 1 ? 's' : ''} cadastrad${clients.length > 1 ? 'os' : 'o'}`
            : 'Nenhum cliente cadastrado ainda.';
    }
    if (vehiclesSummaryText) {
        vehiclesSummaryText.textContent = vehicles.length
            ? `${vehiclesAvailable} disponíveis de ${vehicles.length}`
            : 'Nenhum veículo cadastrado ainda.';
    }
    if (rentalsSummaryText) {
        rentalsSummaryText.textContent = vehiclesRented
            ? `${vehiclesRented} locação${vehiclesRented > 1 ? 'es' : ''} ativa${vehiclesRented > 1 ? 's' : ''}`
            : 'Nenhuma locação ativa.';
    }
}

function editClient(id) {
    const clients = getStorageData(CLIENTS_KEY);
    const client = clients.find(c => c.id === id);

    if (!client) {
        alert('Cliente não encontrado!');
        return;
    }

    const nome = prompt('Nome Completo:', client.nome);
    if (nome === null) return;

    const cpf = prompt('CPF:', client.cpf);
    if (cpf === null) return;

    const email = prompt('E-mail:', client.email);
    if (email === null) return;

    const telefone = prompt('Telefone:', client.telefone);
    if (telefone === null) return;

    const endereco = prompt('Endereço Completo:', client.endereco);
    if (endereco === null) return;

    const updatedClients = clients.map(c => 
        c.id === id 
            ? { ...c, nome: nome.trim(), cpf: cpf.trim(), email: email.trim(), telefone: telefone.trim(), endereco: endereco.trim() }
            : c
    );

    setStorageData(CLIENTS_KEY, updatedClients);
    renderClientsTable();
    updateDashboardCards();
    alert('Cliente atualizado com sucesso!');
}

function deleteClient(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }

    const clients = getStorageData(CLIENTS_KEY);
    const updatedClients = clients.filter(c => c.id !== id);
    setStorageData(CLIENTS_KEY, updatedClients);
    renderClientsTable();
    updateDashboardCards();
    alert('Cliente excluído com sucesso!');
}

function editVehicle(id) {
    const vehicles = getStorageData(VEHICLES_KEY);
    const vehicle = vehicles.find(v => v.id === id);

    if (!vehicle) {
        alert('Veículo não encontrado!');
        return;
    }

    const marca = prompt('Marca:', vehicle.marca);
    if (marca === null) return;

    const modelo = prompt('Modelo:', vehicle.modelo);
    if (modelo === null) return;

    const ano = prompt('Ano:', vehicle.ano);
    if (ano === null) return;

    const placa = prompt('Placa:', vehicle.placa);
    if (placa === null) return;

    const diaria = prompt('Valor da Diária (R$):', vehicle.diaria);
    if (diaria === null) return;

    const statusOptions = 'Disponível,Alugado';
    const status = prompt(`Status (${statusOptions}):`, vehicle.status);
    if (status === null) return;

    if (!['Disponível', 'Alugado'].includes(status)) {
        alert('Status inválido! Use "Disponível" ou "Alugado".');
        return;
    }

    const updatedVehicles = vehicles.map(v =>
        v.id === id
            ? { ...v, marca: marca.trim(), modelo: modelo.trim(), ano: ano.trim(), placa: placa.trim(), diaria: diaria.trim(), status }
            : v
    );

    setStorageData(VEHICLES_KEY, updatedVehicles);
    renderVehiclesTable();
    updateDashboardCards();
    alert('Veículo atualizado com sucesso!');
}

function deleteVehicle(id) {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) {
        return;
    }

    const vehicles = getStorageData(VEHICLES_KEY);
    const updatedVehicles = vehicles.filter(v => v.id !== id);
    setStorageData(VEHICLES_KEY, updatedVehicles);
    renderVehiclesTable();
    updateDashboardCards();
    alert('Veículo excluído com sucesso!');
}

function handleClientForm() {
    const form = document.getElementById('formCliente');
    const alertBox = document.getElementById('clientAlert');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const client = {
            id: Date.now(),
            nome: form.nome.value.trim(),
            cpf: form.cpf.value.trim(),
            email: form.email.value.trim(),
            telefone: form.telefone.value.trim(),
            endereco: form.endereco.value.trim()
        };

        const clients = getStorageData(CLIENTS_KEY);
        clients.push(client);
        setStorageData(CLIENTS_KEY, clients);

        alertBox.classList.remove('d-none');
        alertBox.textContent = 'Cliente salvo com sucesso!';
        form.reset();
        form.classList.remove('was-validated');
        updateDashboardCards();
        renderClientsTable();
    });
}

function handleVehicleForm() {
    const form = document.getElementById('formVeiculo');
    const alertBox = document.getElementById('vehicleAlert');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const vehicle = {
            id: Date.now(),
            marca: form.marca.value.trim(),
            modelo: form.modelo.value.trim(),
            ano: form.ano.value.trim(),
            placa: form.placa.value.trim(),
            diaria: form.diaria.value.trim(),
            status: form.status.value
        };

        const vehicles = getStorageData(VEHICLES_KEY);
        vehicles.push(vehicle);
        setStorageData(VEHICLES_KEY, vehicles);

        alertBox.classList.remove('d-none');
        alertBox.textContent = 'Veículo salvo com sucesso!';
        form.reset();
        form.classList.remove('was-validated');
        updateDashboardCards();
        renderVehiclesTable();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    const initialTheme = loadTheme();
    setTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            const nextTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            localStorage.setItem(THEME_KEY, nextTheme);
        });
    }

    handleClientForm();
    handleVehicleForm();
    renderClientsTable();
    renderVehiclesTable();
    updateDashboardCards();

    // Ensure first carousel item is active
    const carouselElement = document.getElementById('ofertasCarousel');
    if (carouselElement) {
        const carouselItems = carouselElement.querySelectorAll('.carousel-item');
        carouselItems.forEach((item, index) => {
            if (index === 0) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 5000,
            wrap: true
        });
    }
});
