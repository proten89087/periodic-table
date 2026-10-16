const container = document.getElementById('table-container');
const modal = document.getElementById('modal');
const searchInput = document.getElementById('search');

elementsData.forEach(el => {
    const div = document.createElement('div');
    div.className = `element ${el.type}-element`;
    div.style.gridColumn = el.col;
    div.style.gridRow = el.row;
    div.setAttribute('data-num', el.num);
    div.setAttribute('data-name', el.name.toLowerCase());
    div.setAttribute('data-sym', el.sym.toLowerCase());

    div.innerHTML = `
        <div class="num">${el.num}</div>
        <div class="symbol">${el.sym}</div>
        <div class="name">${el.name}</div>
        <div class="mass">${el.mass}</div>
    `;

    div.addEventListener('click', () => openModal(el));
    container.appendChild(div);
});

searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    const gridElements = container.querySelectorAll('.element');
    
    gridElements.forEach(item => {
        const name = item.getAttribute('data-name');
        const sym = item.getAttribute('data-sym');
        const num = item.getAttribute('data-num');

        const isMatch = !val || name.includes(val) || sym.includes(val) || num === val;

        if (isMatch) {
            item.classList.remove('fade-out');
        } else {
            item.classList.add('fade-out');
        }
    });
});

function openModal(el) {
    const card = document.getElementById('modal-card');
    const color = window.getComputedStyle(container.querySelector(`[data-num="${el.num}"]`)).color;
    card.style.color = color;

    document.getElementById('m-num').innerText = el.num;
    document.getElementById('m-sym').innerText = el.sym;
    document.getElementById('m-name').innerText = el.name;
    document.getElementById('m-mass').innerText = el.mass;
    document.getElementById('m-density').innerText = el.density;
    document.getElementById('m-melt').innerText = el.melt;
    document.getElementById('m-boil').innerText = el.boil;

    const shellsContainer = document.getElementById('m-shells');
    shellsContainer.innerHTML = el.shells.map(s => `<div>${s}</div>`).join('');

    const ringsContainer = document.getElementById('m-rings');
    ringsContainer.innerHTML = '';
    
    const maxRings = el.shells.length;
    el.shells.forEach((countStr, ringIdx) => {
        const count = parseInt(countStr);
        const radius = 35 + ((ringIdx + 1) * (55 / maxRings)); 
        
        const orbit = document.createElement('div');
        orbit.className = 'modal-orbit';
        orbit.style.width = `${radius}%`;
        orbit.style.height = `${radius}%`;
        orbit.style.animationDuration = `${4 + (ringIdx * 2)}s`; 

        for (let i = 0; i < count; i++) {
            const electron = document.createElement('div');
            electron.className = 'modal-electron';
            const angle = (i * 2 * Math.PI) / count;
            const x = 50 + 50 * Math.cos(angle);
            const y = 50 + 50 * Math.sin(angle);
            electron.style.left = `${x}%`;
            electron.style.top = `${y}%`;
            orbit.appendChild(electron);
        }
        ringsContainer.appendChild(orbit);
    });

    modal.style.display = 'flex';
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 40; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();
