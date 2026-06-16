document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const THEME_KEY = 'dudsmobirent-theme';
    const CLIENTS_KEY = 'dudsmobirent-clients';
    const VEHICLES_KEY = 'dudsmobirent-vehicles';

    function setTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);
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
        return Number(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function buildBadge(status) {
        const badge = document.createElement('span');
        badge.className = 'badge badge-status';
        badge.textContent = status;
        badge.classList.add(status === 'Alugado' ? 'badge-rented' : 'badge-available');
        return badge;
    }

    function renderClientsTable() {
        const tableBody = document.getElementById('clientsTableBody');
        const clients = getStorageData(CLIENTS_KEY);

        if (!tableBody) return;

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
                <td><button class="btn btn-sm btn-outline-secondary" type="button">Editar</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderVehiclesTable() {
        const tableBody = document.getElementById('vehiclesTableBody');
        const vehicles = getStorageData(VEHICLES_KEY);

        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (!vehicles.length) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-light-gray py-4">Nenhum veículo cadastrado ainda.</td></tr>';
            return;
        }

        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            const badge = buildBadge(vehicle.status);
            row.innerHTML = `
                <td>${vehicle.marca}</td>
                <td>${vehicle.modelo}</td>
                <td>${vehicle.ano}</td>
                <td>${vehicle.placa}</td>
                <td>${formatCurrency(vehicle.diaria)}</td>
                <td></td>
                <td><button class="btn btn-sm btn-outline-secondary" type="button">Editar</button></td>
            `;
            row.children[5].appendChild(badge);
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

        if (totalClientsCount) {
            totalClientsCount.textContent = clients.length;
        }
        if (availableVehiclesCount) {
            availableVehiclesCount.textContent = vehiclesAvailable;
        }
        if (activeRentalsCount) {
            activeRentalsCount.textContent = vehiclesRented;
        }
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
        });
    }

    if (themeToggleBtn) {
        const initialTheme = loadTheme();
        setTheme(initialTheme);

        themeToggleBtn.addEventListener('click', function () {
            const nextTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            localStorage.setItem(THEME_KEY, nextTheme);
        });
    } else {
        setTheme(loadTheme());
    }

    handleClientForm();
    handleVehicleForm();
    renderClientsTable();
    renderVehiclesTable();
    updateDashboardCards();
});