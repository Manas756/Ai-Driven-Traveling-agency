gsap.registerPlugin(MotionPathPlugin);

let animationContext = null;

function buildOrbitPath(size) {
    const center = size / 2;
    const radiusX = size * 0.5;
    const radiusY = size * 0.24;
    const startX = center - radiusX;
    const endX = center + radiusX;
    return {
        center,
        path: `M ${startX},${center}
               C ${center - radiusX * 0.75},${center - radiusY}
                 ${center + radiusX * 0.75},${center - radiusY}
                 ${endX},${center}
               C ${center + radiusX * 0.75},${center + radiusY}
                 ${center - radiusX * 0.75},${center + radiusY}
                 ${startX},${center}`
    };
}

function buildMoonOrbitPath(size) {
    const center = size / 2;
    const radiusX = size * 0.64;
    const radiusY = size * 0.33;
    const startX = center - radiusX;
    const endX = center + radiusX;
    return `M ${startX},${center}
            C ${center - radiusX * 0.72},${center - radiusY}
              ${center + radiusX * 0.72},${center - radiusY}
              ${endX},${center}
            C ${center + radiusX * 0.72},${center + radiusY}
              ${center - radiusX * 0.72},${center + radiusY}
              ${startX},${center}`;
}

function initTravelAnimation() {
    const globeContainer = document.querySelector('.globe-container');
    const globe = document.querySelector('.globe');
    const plane = document.querySelector('.plane');

    if (!globeContainer || !globe || !plane) {
        return;
    }

    if (animationContext) {
        animationContext.revert();
    }

    animationContext = gsap.context(() => {
        const size = globeContainer.offsetWidth;
        const orbit = buildOrbitPath(size);
        const moonOrbitPath = buildMoonOrbitPath(size);
        const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
        const motionDuration = isSmallScreen ? 16 : 14;
        const floatDistance = isSmallScreen ? 5 : 8;
        const moonDuration = isSmallScreen ? 22 : 18;
        const earthOrbitRadiusX = isSmallScreen ? 6 : 10;
        const earthOrbitRadiusY = isSmallScreen ? 4 : 7;
        let moon = globeContainer.querySelector('.moon');

        if (!moon) {
            moon = document.createElement('div');
            moon.className = 'moon';
            globeContainer.appendChild(moon);
        }

        gsap.set(plane, {
            xPercent: -50,
            yPercent: -50,
            transformOrigin: "50% 50%",
            willChange: "transform"
        });
        gsap.set(moon, {
            xPercent: -50,
            yPercent: -50,
            willChange: "transform"
        });

        gsap.to(plane, {
            duration: motionDuration,
            repeat: -1,
            ease: "power1.inOut",
            motionPath: {
                path: orbit.path,
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
            }
        });

        gsap.to(moon, {
            duration: moonDuration,
            repeat: -1,
            ease: "none",
            motionPath: {
                path: moonOrbitPath,
                autoRotate: false,
                alignOrigin: [0.5, 0.5]
            }
        });

        gsap.to(moon, {
            duration: 3.6,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            scale: 1.06,
            opacity: 0.92
        });

        gsap.to(globe, {
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            scale: 1.01,
            opacity: 0.95
        });

        gsap.to(globeContainer, {
            duration: isSmallScreen ? 24 : 20,
            repeat: -1,
            ease: "none",
            keyframes: [
                { x: earthOrbitRadiusX, y: -earthOrbitRadiusY * 0.2 },
                { x: earthOrbitRadiusX * 0.35, y: -earthOrbitRadiusY },
                { x: -earthOrbitRadiusX * 0.75, y: -earthOrbitRadiusY * 0.35 },
                { x: -earthOrbitRadiusX, y: earthOrbitRadiusY * 0.45 },
                { x: earthOrbitRadiusX * 0.25, y: earthOrbitRadiusY },
                { x: earthOrbitRadiusX, y: -earthOrbitRadiusY * 0.2 }
            ]
        });

        gsap.to(globeContainer, {
            duration: 18,
            rotation: -4.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            transformOrigin: `${orbit.center}px ${orbit.center}px`
        });

        gsap.to(globeContainer, {
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            scale: 1.012
        });
    }, globeContainer);
}

const debouncedResize = (() => {
    let timer = null;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            initTravelAnimation();
        }, 140);
    };
})();

window.addEventListener("resize", debouncedResize, { passive: true });
window.addEventListener("DOMContentLoaded", initTravelAnimation);
