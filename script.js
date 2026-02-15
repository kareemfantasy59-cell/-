// Antiko Team Hacking Animation Script
const initBackground = () => {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let matrixCols = [];
    let circuits = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        // Init Matrix rain columns
        const fontSize = 16;
        const columns = Math.ceil(width / fontSize);
        matrixCols = new Array(columns).fill(0).map(() => Math.random() * -100);

        // Init Circuits
        initCircuits();
    };

    const initCircuits = () => {
        circuits = [];
        const count = 15;
        for (let i = 0; i < count; i++) {
            circuits.push({
                segments: generateCircuitPath(),
                progress: 0,
                speed: 0.002 + Math.random() * 0.005,
                delay: Math.random() * 2000
            });
        }
    };

    const generateCircuitPath = () => {
        const segments = [];
        let curX = Math.random() * width;
        let curY = Math.random() * height;
        const length = 5 + Math.floor(Math.random() * 5);

        for (let i = 0; i < length; i++) {
            const angle = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2][Math.floor(Math.random() * 4)];
            const dist = 50 + Math.random() * 100;
            const nextX = curX + Math.cos(angle) * dist;
            const nextY = curY + Math.sin(angle) * dist;
            segments.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });
            curX = nextX;
            curY = nextY;
        }
        return segments;
    };

    const drawMatrix = () => {
        ctx.clearRect(0, 0, width, height); // Clear instead of filling with black

        ctx.fillStyle = "rgba(255, 0, 51, 0.4)";
        ctx.font = "16px monospace";

        const chars = "010101ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        matrixCols.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * 16;
            ctx.fillText(char, x, y);

            if (y > height && Math.random() > 0.975) {
                matrixCols[i] = 0;
            } else {
                matrixCols[i] += 12;
            }
        });
    };

    const drawCircuits = () => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff0033";
        ctx.lineWidth = 1.5;

        circuits.forEach(circuit => {
            circuit.progress += circuit.speed;
            if (circuit.progress > 1) {
                circuit.progress = 0;
                circuit.segments = generateCircuitPath();
            }

            const totalSegments = circuit.segments.length;
            const currentGlobalProgress = circuit.progress * totalSegments;

            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 0, 51, 0.2)";
            circuit.segments.forEach((s, idx) => {
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);

                if (Math.floor(currentGlobalProgress) === idx) {
                    const localProgress = currentGlobalProgress % 1;
                    const dotX = s.x1 + (s.x2 - s.x1) * localProgress;
                    const dotY = s.y1 + (s.y2 - s.y1) * localProgress;
                    ctx.save();
                    ctx.fillStyle = "#fff";
                    ctx.shadowBlur = 20;
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });
            ctx.stroke();
        });

        ctx.shadowBlur = 0;
    };

    const animate = () => {
        drawMatrix();
        drawCircuits();
        requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) / 40;
        const moveY = (e.clientY - window.innerHeight / 2) / 40;

        canvas.style.transform = `translate(${moveX}px, ${moveY}px)`;

        const bgImg = document.getElementById('bg-image');
        if (bgImg) {
            bgImg.style.transform = `translate(${-moveX / 2}px, ${-moveY / 2}px) scale(1.1)`;
        }
    });

    resize();
    animate();
};

document.addEventListener("DOMContentLoaded", () => {
    initBackground();

    // Staggered entry
    document.querySelectorAll('.staggered-entry').forEach((el, i) => {
        el.style.animationDelay = `${i * 0.1}s`;
    });
});
