// Wacht tot de pagina volledig is geladen
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. IP-ADRES KOPIËREN
    // Deze functie wordt aangeroepen als je op de IP-box klikt
    window.copyIP = function() {
        const ip = "netherlandsmp2.aternos.me";
        
        navigator.clipboard.writeText(ip).then(() => {
            alert("✅ IP Adres gekopieerd: " + ip);
        }).catch(err => {
            console.error('Fout bij kopiëren: ', err);
        });
    };

    // 2. DISCORD KNOP CONTROLE
    // We zorgen dat alle knoppen met de tekst 'join de discord' de juiste link hebben
    const discordButtons = document.querySelectorAll('a');
    const discordLink = "https://discord.com/invite/MqGPSrWAp6";

    discordButtons.forEach(button => {
        if (button.textContent.toLowerCase().includes('discord')) {
            button.href = discordLink;
            button.target = "_blank"; // Opent in een nieuw tabblad
        }
    });

    // 3. SMOOTH SCROLL
    // Zorgt voor een vloeiende beweging als je op 'ons team' of 'over ons' klikt
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});