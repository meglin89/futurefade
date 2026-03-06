(function() {
    // Shared TouchTexture class
    class TouchTexture {
        constructor() {
            this.size = 64;
            this.maxAge = 64;
            this.radius = 0.25 * this.size;
            this.speed = 1 / this.maxAge;
            this.trail = [];
            this.last = null;
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.canvas.height = this.size;
            this.ctx = this.canvas.getContext('2d');
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.size, this.size);
            this.texture = new THREE.Texture(this.canvas);
        }
        update() {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.size, this.size);
            for (let i = this.trail.length - 1; i >= 0; i--) {
                const p = this.trail[i];
                let f = p.force * this.speed * (1 - p.age / this.maxAge);
                p.x += p.vx * f; p.y += p.vy * f; p.age++;
                if (p.age > this.maxAge) { this.trail.splice(i, 1); continue; }
                const pos = { x: p.x * this.size, y: (1 - p.y) * this.size };
                let intensity = 1;
                if (p.age < this.maxAge * 0.3) {
                    intensity = Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2));
                } else {
                    const t = 1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
                    intensity = -t * (t - 2);
                }
                intensity *= p.force;
                const color = `${((p.vx+1)/2)*255}, ${((p.vy+1)/2)*255}, ${intensity*255}`;
                const offset = this.size * 5;
                this.ctx.shadowOffsetX = offset; this.ctx.shadowOffsetY = offset;
                this.ctx.shadowBlur = this.radius;
                this.ctx.shadowColor = `rgba(${color},${0.2*intensity})`;
                this.ctx.beginPath(); this.ctx.fillStyle = 'rgba(255,0,0,1)';
                this.ctx.arc(pos.x-offset, pos.y-offset, this.radius, 0, Math.PI*2); this.ctx.fill();
            }
            this.texture.needsUpdate = true;
        }
        addTouch(point) {
            let force = 0, vx = 0, vy = 0;
            if (this.last) {
                const dx = point.x-this.last.x, dy = point.y-this.last.y;
                if (dx===0 && dy===0) return;
                const d = Math.sqrt(dx*dx+dy*dy);
                vx = dx/d; vy = dy/d;
                force = Math.min((dx*dx+dy*dy)*20000, 2.0);
            }
            this.last = { x: point.x, y: point.y };
            this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
        }
    }

    // Shared shaders
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vUv = uv;
        }
    `;
    const fragmentShader = `
        uniform float uTime; uniform vec2 uResolution;
        uniform vec3 uColor1,uColor2,uColor3,uColor4,uColor5,uColor6;
        uniform float uSpeed,uIntensity; uniform sampler2D uTouchTexture;
        uniform float uGrainIntensity,uGradientSize,uGradientCount,uColor1Weight,uColor2Weight;
        uniform vec3 uDarkNavy; varying vec2 vUv;
        float grain(vec2 uv,float time){vec2 g=uv*uResolution*0.5;return fract(sin(dot(g+time,vec2(12.9898,78.233)))*43758.5453)*2.0-1.0;}
        vec3 getGradientColor(vec2 uv,float time){
            float r=uGradientSize;
            vec2 c1=vec2(0.5+sin(time*uSpeed*0.4)*0.4,0.5+cos(time*uSpeed*0.5)*0.4);
            vec2 c2=vec2(0.5+cos(time*uSpeed*0.6)*0.5,0.5+sin(time*uSpeed*0.45)*0.5);
            vec2 c3=vec2(0.5+sin(time*uSpeed*0.35)*0.45,0.5+cos(time*uSpeed*0.55)*0.45);
            vec2 c4=vec2(0.5+cos(time*uSpeed*0.5)*0.4,0.5+sin(time*uSpeed*0.4)*0.4);
            vec2 c5=vec2(0.5+sin(time*uSpeed*0.7)*0.35,0.5+cos(time*uSpeed*0.6)*0.35);
            vec2 c6=vec2(0.5+cos(time*uSpeed*0.45)*0.5,0.5+sin(time*uSpeed*0.65)*0.5);
            vec2 c7=vec2(0.5+sin(time*uSpeed*0.55)*0.38,0.5+cos(time*uSpeed*0.48)*0.42);
            vec2 c8=vec2(0.5+cos(time*uSpeed*0.65)*0.36,0.5+sin(time*uSpeed*0.52)*0.44);
            vec2 c9=vec2(0.5+sin(time*uSpeed*0.42)*0.41,0.5+cos(time*uSpeed*0.58)*0.39);
            vec2 c10=vec2(0.5+cos(time*uSpeed*0.48)*0.37,0.5+sin(time*uSpeed*0.62)*0.43);
            vec2 c11=vec2(0.5+sin(time*uSpeed*0.68)*0.33,0.5+cos(time*uSpeed*0.44)*0.46);
            vec2 c12=vec2(0.5+cos(time*uSpeed*0.38)*0.39,0.5+sin(time*uSpeed*0.56)*0.41);
            float i1=1.0-smoothstep(0.0,r,length(uv-c1)),i2=1.0-smoothstep(0.0,r,length(uv-c2));
            float i3=1.0-smoothstep(0.0,r,length(uv-c3)),i4=1.0-smoothstep(0.0,r,length(uv-c4));
            float i5=1.0-smoothstep(0.0,r,length(uv-c5)),i6=1.0-smoothstep(0.0,r,length(uv-c6));
            float i7=1.0-smoothstep(0.0,r,length(uv-c7)),i8=1.0-smoothstep(0.0,r,length(uv-c8));
            float i9=1.0-smoothstep(0.0,r,length(uv-c9)),i10=1.0-smoothstep(0.0,r,length(uv-c10));
            float i11=1.0-smoothstep(0.0,r,length(uv-c11)),i12=1.0-smoothstep(0.0,r,length(uv-c12));
            vec2 ru1=uv-0.5;float a1=time*uSpeed*0.15;
            ru1=vec2(ru1.x*cos(a1)-ru1.y*sin(a1),ru1.x*sin(a1)+ru1.y*cos(a1))+0.5;
            vec2 ru2=uv-0.5;float a2=-time*uSpeed*0.12;
            ru2=vec2(ru2.x*cos(a2)-ru2.y*sin(a2),ru2.x*sin(a2)+ru2.y*cos(a2))+0.5;
            float ri1=1.0-smoothstep(0.0,0.8,length(ru1-0.5));
            float ri2=1.0-smoothstep(0.0,0.8,length(ru2-0.5));
            vec3 color=vec3(0.0);
            color+=uColor1*i1*(0.55+0.45*sin(time*uSpeed))*uColor1Weight;
            color+=uColor2*i2*(0.55+0.45*cos(time*uSpeed*1.2))*uColor2Weight;
            color+=uColor3*i3*(0.55+0.45*sin(time*uSpeed*0.8))*uColor1Weight;
            color+=uColor4*i4*(0.55+0.45*cos(time*uSpeed*1.3))*uColor2Weight;
            color+=uColor5*i5*(0.55+0.45*sin(time*uSpeed*1.1))*uColor1Weight;
            color+=uColor6*i6*(0.55+0.45*cos(time*uSpeed*0.9))*uColor2Weight;
            if(uGradientCount>6.0){
                color+=uColor1*i7*(0.55+0.45*sin(time*uSpeed*1.4))*uColor1Weight;
                color+=uColor2*i8*(0.55+0.45*cos(time*uSpeed*1.5))*uColor2Weight;
                color+=uColor3*i9*(0.55+0.45*sin(time*uSpeed*1.6))*uColor1Weight;
                color+=uColor4*i10*(0.55+0.45*cos(time*uSpeed*1.7))*uColor2Weight;
            }
            if(uGradientCount>10.0){
                color+=uColor5*i11*(0.55+0.45*sin(time*uSpeed*1.8))*uColor1Weight;
                color+=uColor6*i12*(0.55+0.45*cos(time*uSpeed*1.9))*uColor2Weight;
            }
            color+=mix(uColor1,uColor3,ri1)*0.45*uColor1Weight;
            color+=mix(uColor2,uColor4,ri2)*0.4*uColor2Weight;
            color=clamp(color,vec3(0.0),vec3(1.0))*uIntensity;
            float lum=dot(color,vec3(0.299,0.587,0.114));
            color=mix(vec3(lum),color,1.35);color=pow(color,vec3(0.92));
            float b1=length(color);color=mix(uDarkNavy,color,max(b1*1.2,0.15));
            float b=length(color);if(b>1.0)color*=1.0/b;return color;
        }
        void main(){
            vec2 uv=vUv;vec4 tt=texture2D(uTouchTexture,uv);
            float vx=-(tt.r*2.0-1.0),vy=-(tt.g*2.0-1.0),ti=tt.b;
            uv.x+=vx*0.8*ti;uv.y+=vy*0.8*ti;
            vec2 center=vec2(0.5);float dist=length(uv-center);
            float ripple=sin(dist*20.0-uTime*3.0)*0.04*ti;
            float wave=sin(dist*15.0-uTime*2.0)*0.03*ti;
            uv+=vec2(ripple+wave);
            vec3 color=getGradientColor(uv,uTime);
            color+=grain(uv,uTime)*uGrainIntensity;
            float ts=uTime*0.5;
            color.r+=sin(ts)*0.02;color.g+=cos(ts*1.4)*0.02;color.b+=sin(ts*1.2)*0.02;
            float b2=length(color);color=mix(uDarkNavy,color,max(b2*1.2,0.15));
            color=clamp(color,vec3(0.0),vec3(1.0));
            float b=length(color);if(b>1.0)color*=1.0/b;
            gl_FragColor=vec4(color,1.0);
        }
    `;

    // Factory: create a gradient instance for any section
    function createGradient(containerId, sectionId, colors) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, stencil: false, depth: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
        camera.position.z = 50;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(colors.bg);
        const clock = new THREE.Clock();
        const touchTex = new TouchTexture();

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2() },
            uColor1: { value: new THREE.Vector3(...colors.c1) },
            uColor2: { value: new THREE.Vector3(...colors.c2) },
            uColor3: { value: new THREE.Vector3(...colors.c3) },
            uColor4: { value: new THREE.Vector3(...colors.c4) },
            uColor5: { value: new THREE.Vector3(...colors.c5) },
            uColor6: { value: new THREE.Vector3(...colors.c6) },
            uSpeed: { value: colors.speed || 0.8 },
            uIntensity: { value: colors.intensity || 1.4 },
            uTouchTexture: { value: touchTex.texture },
            uGrainIntensity: { value: 0.06 },
            uDarkNavy: { value: new THREE.Vector3(...colors.base) },
            uGradientSize: { value: colors.gradientSize || 0.5 },
            uGradientCount: { value: 12.0 },
            uColor1Weight: { value: colors.w1 || 0.45 },
            uColor2Weight: { value: colors.w2 || 1.6 }
        };

        function getViewSize() {
            const fov = (camera.fov * Math.PI) / 180;
            const h = Math.abs(camera.position.z * Math.tan(fov / 2) * 2);
            return { width: h * camera.aspect, height: h };
        }

        const vs = getViewSize();
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(vs.width, vs.height, 1, 1),
            new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
        );
        scene.add(mesh);

        function resize() {
            const rect = container.getBoundingClientRect();
            const w = rect.width, h = rect.height;
            if (w === 0 || h === 0) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            uniforms.uResolution.value.set(w, h);
            const nvs = getViewSize();
            mesh.geometry.dispose();
            mesh.geometry = new THREE.PlaneGeometry(nvs.width, nvs.height, 1, 1);
        }
        resize();

        let isVisible = false;
        const obs = new IntersectionObserver(entries => {
            isVisible = entries[0].isIntersecting;
        }, { threshold: 0 });
        obs.observe(document.getElementById(sectionId));

        function tick() {
            requestAnimationFrame(tick);
            if (!isVisible) return;
            const delta = Math.min(clock.getDelta(), 0.1);
            touchTex.update();
            uniforms.uTime.value += delta;
            renderer.render(scene, camera);
        }
        tick();

        function onMove(x, y) {
            const rect = container.getBoundingClientRect();
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
            touchTex.addTouch({
                x: (x - rect.left) / rect.width,
                y: 1 - (y - rect.top) / rect.height
            });
        }
        window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
        window.addEventListener('touchmove', e => { const t = e.touches[0]; onMove(t.clientX, t.clientY); });
        window.addEventListener('resize', resize);
    }

    // Hero — purple + gold on dark
    createGradient('heroGradient', 'hero', {
        bg: 0x0a0a0f,
        base: [0.039, 0.039, 0.059],
        c1: [0.424, 0.388, 1.0],       // accent purple
        c2: [0.039, 0.039, 0.059],      // bg primary
        c3: [0.788, 0.663, 0.431],      // gold
        c4: [0.067, 0.067, 0.094],      // bg secondary
        c5: [0.3, 0.27, 0.85],          // deeper purple
        c6: [0.039, 0.039, 0.059],      // bg primary
        speed: 0.8, intensity: 1.4, w1: 0.45, w2: 1.6, gradientSize: 0.5
    });

    // CTA — teal + warm copper on deep navy
    createGradient('ctaGradient', 'contact', {
        bg: 0x0a0e14,
        base: [0.039, 0.055, 0.08],
        c1: [0.18, 0.65, 0.6],          // teal
        c2: [0.039, 0.055, 0.08],       // deep navy
        c3: [0.75, 0.45, 0.25],         // warm copper
        c4: [0.05, 0.06, 0.1],          // dark
        c5: [0.12, 0.5, 0.55],          // darker teal
        c6: [0.039, 0.055, 0.08],       // deep navy
        speed: 0.6, intensity: 1.2, w1: 0.4, w2: 1.8, gradientSize: 0.55
    });
})();
