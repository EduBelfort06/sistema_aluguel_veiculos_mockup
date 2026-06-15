document.addEventListener("DOMContentLoaded", function() {
    // Simulação de submissão de formulários
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita recarregar a página
            alert('Ação realizada com sucesso! (Mockup)');
            form.reset(); // Limpa os campos
        });
    });
});