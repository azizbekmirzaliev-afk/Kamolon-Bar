import React, { useEffect, useRef } from 'react';
import { getIngredientById, INGREDIENT_CATEGORIES } from '../game/ingredients';
import { CustomerProfile, GameScreenState, OrderEvaluation, VesselId } from '../game/types';

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
}

export interface KamolonCanvasProps {
  gameState: GameScreenState;
  targetStationX: number;
  customer: CustomerProfile | null;
  drinkName?: string;
  addedIngredientIds: string[];
  selectedVessel?: VesselId;
  lastEvaluation: OrderEvaluation | null;
  actionPulseKey: number;
  onBaristaMove?: (normX: number) => void;
}

const PARTICLE_POOL_SIZE = 48;

export const KamolonCanvas: React.FC<KamolonCanvasProps> = ({
  gameState,
  targetStationX,
  customer,
  drinkName,
  addedIngredientIds,
  selectedVessel = 'standart',
  lastEvaluation,
  actionPulseKey,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync latest React props into refs so RAF never tears down
  const propsRef = useRef({
    gameState,
    targetStationX,
    customer,
    drinkName,
    addedIngredientIds,
    selectedVessel,
    lastEvaluation,
  });
  propsRef.current = {
    gameState,
    targetStationX,
    customer,
    drinkName,
    addedIngredientIds,
    selectedVessel,
    lastEvaluation,
  };

  // Simulation state (owned inside canvas loop)
  const simRef = useRef({
    baristaX: 0.45,
    baristaFacing: 1,
    walkPhase: 0,
    actionTimer: 0,
    customerX: 1.12,
    keys: new Set<string>(),
    lastActionKey: 0,
    lastCustomerId: '',
    particles: Array.from({ length: PARTICLE_POOL_SIZE }, (): Particle => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      radius: 3,
      color: '#fde68a',
    })),
    particleCursor: 0,
    steamTimer: 0,
  });

  // Trigger burst when ingredient added or drink served
  useEffect(() => {
    if (actionPulseKey !== simRef.current.lastActionKey) {
      simRef.current.lastActionKey = actionPulseKey;
      simRef.current.actionTimer = 0.55;
      const sim = simRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const w = canvas.clientWidth || 900;
        const h = canvas.clientHeight || 280;
        const bx = sim.baristaX * w;
        const by = h * 0.62;
        for (let i = 0; i < 8; i++) {
          const p = sim.particles[sim.particleCursor];
          sim.particleCursor = (sim.particleCursor + 1) % PARTICLE_POOL_SIZE;
          p.active = true;
          p.x = bx + (Math.random() - 0.5) * 28;
          p.y = by - 14 + (Math.random() - 0.5) * 14;
          p.vx = (Math.random() - 0.5) * 70;
          p.vy = -30 - Math.random() * 55;
          p.life = 0;
          p.maxLife = 0.55 + Math.random() * 0.35;
          p.radius = 2.5 + Math.random() * 2.5;
          p.color = i % 2 === 0 ? '#fde68a' : '#f59e0b';
        }
      }
    }
  }, [actionPulseKey]);

  // Reset customer walk-in when customer changes
  useEffect(() => {
    const cid = customer?.id ?? '';
    if (cid && cid !== simRef.current.lastCustomerId) {
      simRef.current.lastCustomerId = cid;
      simRef.current.customerX = 1.08;
    }
  }, [customer?.id]);

  // Keyboard listeners for direct Barista movement (A/D, ArrowLeft/ArrowRight)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
      ) {
        return;
      }
      if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'a' ||
        e.key === 'A' ||
        e.key === 'd' ||
        e.key === 'D'
      ) {
        simRef.current.keys.add(e.key.toLowerCase());
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      simRef.current.keys.delete(e.key.toLowerCase());
    };
    const clearKeys = () => simRef.current.keys.clear();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    document.addEventListener('visibilitychange', clearKeys);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
      document.removeEventListener('visibilitychange', clearKeys);
    };
  }, []);

  // Main Canvas2D simulation & render loop (mounted once)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let rafId = 0;
    let lastTime = performance.now();
    let width = container.clientWidth || 960;
    let height = container.clientHeight || 280;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(320, rect.width);
      height = Math.max(200, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const spawnSteam = (x: number, y: number, color: string) => {
      const sim = simRef.current;
      const p = sim.particles[sim.particleCursor];
      sim.particleCursor = (sim.particleCursor + 1) % PARTICLE_POOL_SIZE;
      p.active = true;
      p.x = x + (Math.random() - 0.5) * 10;
      p.y = y;
      p.vx = (Math.random() - 0.5) * 14;
      p.vy = -18 - Math.random() * 14;
      p.life = 0;
      p.maxLife = 1.1 + Math.random() * 0.5;
      p.radius = 3 + Math.random() * 3.5;
      p.color = color;
    };

    const draw = (now: number) => {
      rafId = requestAnimationFrame(draw);
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      const {
        gameState: state,
        targetStationX: targetX,
        customer: activeCustomer,
        drinkName: activeDrinkName,
        addedIngredientIds: addedIds,
        selectedVessel: vessel,
        lastEvaluation: evalRes,
      } = propsRef.current;

      const sim = simRef.current;
      const isPaused = state === 'paused';

      // Update simulation when not paused
      if (!isPaused) {
        // Player manual movement overrides auto-walk temporarily
        let manualDir = 0;
        if (state === 'playing') {
          if (sim.keys.has('arrowleft') || sim.keys.has('a')) manualDir -= 1;
          if (sim.keys.has('arrowright') || sim.keys.has('d')) manualDir += 1;
        }

        if (manualDir !== 0) {
          const prevX = sim.baristaX;
          sim.baristaX = Math.max(0.08, Math.min(0.92, sim.baristaX + manualDir * 0.48 * dt));
          sim.baristaFacing = manualDir > 0 ? 1 : -1;
          sim.walkPhase += Math.abs(sim.baristaX - prevX) * 58;
        } else {
          // Smooth walk to target bar station
          const diff = targetX - sim.baristaX;
          if (Math.abs(diff) > 0.004) {
            const step = Math.sign(diff) * Math.min(Math.abs(diff), 0.55 * dt);
            sim.baristaX += step;
            sim.baristaFacing = diff > 0 ? 1 : -1;
            sim.walkPhase += Math.abs(step) * 58;
          }
        }

        if (sim.actionTimer > 0) {
          sim.actionTimer = Math.max(0, sim.actionTimer - dt);
        }

        // Customer approaches counter spot x = 0.52
        const targetCustX = activeCustomer ? 0.52 : 1.15;
        const cDiff = targetCustX - sim.customerX;
        if (Math.abs(cDiff) > 0.003) {
          sim.customerX += Math.sign(cDiff) * Math.min(Math.abs(cDiff), 0.45 * dt);
        }

        // Ambient espresso & samovar steam
        sim.steamTimer += dt;
        if (sim.steamTimer > 0.35) {
          sim.steamTimer = 0;
          spawnSteam(width * 0.14, height * 0.37, 'rgba(255,248,235,0.35)');
          spawnSteam(width * 0.28, height * 0.34, 'rgba(255,248,235,0.28)');
        }

        // Update particles
        for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
          const p = sim.particles[i];
          if (!p.active) continue;
          p.life += dt;
          if (p.life >= p.maxLife) {
            p.active = false;
            continue;
          }
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
      }

      // === RENDER SCENE ===
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = canvas.width / width;
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Warm Kamolon Cafe Back Wall
      const wallGrad = ctx.createLinearGradient(0, 0, 0, height);
      wallGrad.addColorStop(0, '#271b14');
      wallGrad.addColorStop(0.65, '#3b281c');
      wallGrad.addColorStop(1, '#1e140e');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle vertical wood paneling
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height * 0.72);
        ctx.stroke();
      }

      // Uzbek Atlas ornamental frieze band near top
      const friezeY = 14;
      ctx.fillStyle = '#4a2e1b';
      ctx.fillRect(0, friezeY, width, 12);
      for (let x = 0; x < width; x += 28) {
        ctx.fillStyle = (x / 28) % 2 === 0 ? '#d97706' : '#0ea5e9';
        ctx.beginPath();
        ctx.moveTo(x + 14, friezeY + 2);
        ctx.lineTo(x + 22, friezeY + 6);
        ctx.lineTo(x + 14, friezeY + 10);
        ctx.lineTo(x + 6, friezeY + 6);
        ctx.closePath();
        ctx.fill();
      }

      // Hanging Brass Lanterns with warm radial glow
      const lanternXs = [width * 0.22, width * 0.5, width * 0.78];
      lanternXs.forEach((lx, idx) => {
        const sway = Math.sin(now * 0.0014 + idx * 1.8) * 3;
        const glow = ctx.createRadialGradient(lx + sway, 46, 4, lx + sway, 52, 85);
        glow.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
        glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lx + sway, 52, 85, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx + sway, 32);
        ctx.stroke();

        // Lantern body
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(lx + sway - 10, 38);
        ctx.lineTo(lx + sway + 10, 38);
        ctx.lineTo(lx + sway + 7, 50);
        ctx.lineTo(lx + sway - 7, 50);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(lx + sway - 5, 40, 10, 7);
      });

      // Center Brass "KAMOLON" Wall Plaque
      const plaqueW = 148;
      const plaqueX = width * 0.5 - plaqueW / 2;
      ctx.fillStyle = '#241710';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(plaqueX, 34, plaqueW, 32, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fde68a';
      ctx.font = '700 14px Fraunces, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('KAMOLON', width * 0.5, 55);

      // 2. Back Bar Wooden Shelf & 7 Station Icons
      const shelfY = height * 0.44;
      ctx.fillStyle = '#4e3120';
      ctx.fillRect(width * 0.04, shelfY, width * 0.92, 9);

      // Station 1: Espresso Machine (0.14)
      const esX = width * 0.14;
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(esX - 24, shelfY - 36, 48, 36);
      ctx.fillStyle = '#334155';
      ctx.fillRect(esX - 20, shelfY - 32, 40, 14);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(esX - 10, shelfY - 14, 20, 6);

      // Station 2: Samovar / Kettle (0.28)
      const smX = width * 0.28;
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(smX - 13, shelfY - 34, 26, 30, 8);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(smX - 6, shelfY - 40, 12, 6);

      // Station 3: Citrus Crate (0.43)
      const frX = width * 0.43;
      ctx.fillStyle = '#78350f';
      ctx.fillRect(frX - 20, shelfY - 16, 40, 16);
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(frX - 8, shelfY - 18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(frX + 2, shelfY - 19, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(frX + 11, shelfY - 17, 5, 0, Math.PI * 2);
      ctx.fill();

      // Station 4: Syrup Bottles (0.57)
      const syX = width * 0.57;
      ['#fbbf24', '#e11d48', '#10b981'].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(syX - 16 + i * 12, shelfY - 26, 8, 26);
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(syX - 15 + i * 12, shelfY - 18, 6, 8);
      });

      // Station 5: Puree Jars (0.70)
      const puX = width * 0.70;
      ['#f59e0b', '#be123c', '#84cc16'].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(puX - 16 + i * 12, shelfY - 18, 9, 18);
      });

      // Station 6: Juice Carafes (0.82)
      const juX = width * 0.82;
      ['#881337', '#f97316'].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(juX - 12 + i * 15, shelfY - 28, 10, 28);
      });

      // Station 7: Spice Jars (0.92)
      const spX = width * 0.92;
      ['#9a3412', '#d97706', '#581c87'].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(spX - 15 + i * 10, shelfY - 16, 7, 16);
      });

      // Active station subtle spotlight indicator + Desktop station labels
      const activeStation = INGREDIENT_CATEGORIES.find(
        (c) => Math.abs(c.stationX - targetX) < 0.05,
      );
      if (activeStation) {
        const ax = activeStation.stationX * width;
        ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
        ctx.beginPath();
        ctx.arc(ax, shelfY - 14, 28, 0, Math.PI * 2);
        ctx.fill();
      }
      if (width >= 640) {
        ctx.font = '600 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        INGREDIENT_CATEGORIES.forEach((cat) => {
          const isCur = activeStation?.id === cat.id;
          ctx.fillStyle = isCur ? '#fde68a' : 'rgba(214, 185, 149, 0.55)';
          ctx.fillText(cat.shortLabel, cat.stationX * width, shelfY + 21);
        });
      }

      // 3. Draw Playable Barista Character (behind the counter)
      const barY = height * 0.62;
      const bx = sim.baristaX * width;
      const bob = Math.sin(sim.walkPhase) * 2.5;
      const actionSquash = sim.actionTimer > 0 ? Math.sin(sim.actionTimer * 24) * 0.08 : 0;

      ctx.save();
      ctx.translate(bx, barY - 14 + bob);
      ctx.scale(1 - actionSquash, 1 + actionSquash);

      // Torso + Kamolon green apron
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.roundRect(-14, -36, 28, 36, 8);
      ctx.fill();

      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.roundRect(-12, -26, 24, 30, 5);
      ctx.fill();

      // Apron gold emblem
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-5, -18, 10, 3);

      // Head
      ctx.fillStyle = '#f3c6a5';
      ctx.beginPath();
      ctx.arc(0, -48, 13, 0, Math.PI * 2);
      ctx.fill();

      // Hair / Barista cap
      ctx.fillStyle = '#1f1612';
      ctx.beginPath();
      ctx.arc(0, -52, 13, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#065f46';
      ctx.fillRect(-13, -56, 26, 6);
      ctx.fillRect(sim.baristaFacing > 0 ? 4 : -18, -53, 14, 3);

      // Eyes
      const eyeOffsetX = sim.baristaFacing * 3;
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(-4 + eyeOffsetX, -47, 1.8, 0, Math.PI * 2);
      ctx.arc(4 + eyeOffsetX, -47, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(eyeOffsetX, -44, 4, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Arm (animates when mixing/pouring)
      const armAngle = sim.actionTimer > 0 ? -0.9 + Math.sin(sim.actionTimer * 28) * 0.45 : 0.2;
      ctx.save();
      ctx.translate(sim.baristaFacing * 12, -26);
      ctx.rotate(armAngle * sim.baristaFacing);
      ctx.fillStyle = '#f3c6a5';
      ctx.fillRect(-3, 0, 6, 18);
      ctx.restore();

      ctx.restore();

      // 4. Bar Counter (Foreground divider)
      ctx.fillStyle = '#2d1c12';
      ctx.fillRect(0, barY, width, height - barY);

      // Marble counter top
      const counterGrad = ctx.createLinearGradient(0, barY - 8, 0, barY + 8);
      counterGrad.addColorStop(0, '#f5ebe0');
      counterGrad.addColorStop(1, '#d6c3b0');
      ctx.fillStyle = counterGrad;
      ctx.fillRect(0, barY - 6, width, 12);

      // Wooden counter front panels
      ctx.strokeStyle = '#573623';
      ctx.lineWidth = 2;
      for (let x = 24; x < width - 24; x += 96) {
        ctx.strokeRect(x, barY + 14, 72, height - barY - 22);
      }

      // 5. Mixing Glass on Counter (adapts silhouette to selected vessel)
      const cupX = width * 0.34;
      const cupY = barY - 6;
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (vessel === 'xaybol') {
        ctx.rect(cupX - 11, cupY - 44, 22, 44);
      } else if (vessel === 'xarikey') {
        ctx.moveTo(cupX - 15, cupY - 42);
        ctx.quadraticCurveTo(cupX - 13, cupY - 22, cupX - 8, cupY - 10);
        ctx.lineTo(cupX + 8, cupY - 10);
        ctx.quadraticCurveTo(cupX + 13, cupY - 22, cupX + 15, cupY - 42);
        ctx.closePath();
      } else {
        ctx.moveTo(cupX - 15, cupY - 40);
        ctx.lineTo(cupX + 15, cupY - 40);
        ctx.lineTo(cupX + 11, cupY);
        ctx.lineTo(cupX - 11, cupY);
        ctx.closePath();
      }
      ctx.fill();

      // Layered ingredient liquid fills inside counter glass
      const layerCount = Math.min(addedIds.length, 6);
      for (let i = 0; i < layerCount; i++) {
        const ing = getIngredientById(addedIds[i]);
        const layerH = 32 / Math.max(layerCount, 1);
        const ly = cupY - (i + 1) * layerH - (vessel === 'xarikey' ? 8 : 0);
        ctx.fillStyle = ing?.color ?? '#d97706';
        ctx.globalAlpha = 0.85;
        ctx.fillRect(cupX - 9, ly, 18, layerH);
      }
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.restore();

      // 6. Customer at the Counter (Customer Side!)
      if (activeCustomer) {
        const cx = Math.min(width - 54, Math.max(54, sim.customerX * width));
        const cy = Math.min(height - 26, barY + 46);
        const happyBounce =
          evalRes && evalRes.score >= 8 ? Math.abs(Math.sin(now * 0.008)) * 5 : 0;

        ctx.save();
        ctx.translate(cx, cy - happyBounce);

        // Customer Shoulders / Shirt
        ctx.fillStyle = activeCustomer.shirtColor;
        ctx.beginPath();
        ctx.roundRect(-17, -36, 34, 38, 11);
        ctx.fill();

        // Head
        ctx.fillStyle = activeCustomer.skinTone;
        ctx.beginPath();
        ctx.arc(0, -50, 14, 0, Math.PI * 2);
        ctx.fill();

        // Hair / Hat
        if (activeCustomer.hatType === 'hijab') {
          ctx.fillStyle = '#be185d';
          ctx.beginPath();
          ctx.arc(0, -51, 16, Math.PI * 0.85, Math.PI * 2.15);
          ctx.fill();
        } else if (activeCustomer.hatType === 'doppi') {
          ctx.fillStyle = '#1e1b18';
          ctx.beginPath();
          ctx.roundRect(-12, -66, 24, 10, 3);
          ctx.fill();
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(-7, -63, 4, 4);
          ctx.fillRect(3, -63, 4, 4);
        } else if (activeCustomer.hatType === 'cap') {
          ctx.fillStyle = '#0f766e';
          ctx.beginPath();
          ctx.arc(0, -54, 14, Math.PI, 0);
          ctx.fill();
          ctx.fillRect(-18, -55, 13, 4);
        } else if (activeCustomer.hatType === 'beret') {
          ctx.fillStyle = '#881337';
          ctx.beginPath();
          ctx.ellipse(2, -62, 15, 6.5, -0.15, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = activeCustomer.hairColor;
          ctx.beginPath();
          ctx.arc(0, -54, 14, Math.PI, 0);
          ctx.fill();
        }

        // Customer Eyes & Mouth based on score
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(-5, -50, 2, 0, Math.PI * 2);
        ctx.arc(5, -50, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        if (evalRes && evalRes.score < 5) {
          ctx.arc(0, -42, 4, Math.PI + 0.3, -0.3);
        } else {
          ctx.arc(0, -46, 4.5, 0.2, Math.PI - 0.2);
        }
        ctx.stroke();

        // Customer Name Tag cleanly inside bottom bounds
        ctx.fillStyle = 'rgba(27, 20, 16, 0.92)';
        ctx.beginPath();
        ctx.roundRect(-42, 4, 84, 18, 4);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(activeCustomer.name, 0, 16.5);

        // Customer Speech / Rating Bubble to the right of head
        if (activeDrinkName || evalRes) {
          const bubbleText = evalRes
            ? `${evalRes.score} / 10 ★`
            : activeDrinkName!;
          ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
          const tw = Math.min(168, Math.max(76, ctx.measureText(bubbleText).width + 20));
          const bxOff = cx + 26 + tw > width - 8 ? -(tw + 22) : 22;
          const byOff = -66;

          ctx.fillStyle = evalRes
            ? evalRes.score === 10
              ? '#065f46'
              : evalRes.score >= 7
                ? '#78350f'
                : '#7f1d1d'
            : '#fef3c7';
          ctx.strokeStyle = evalRes ? '#f59e0b' : '#b45309';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(bxOff, byOff, tw, 24, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = evalRes ? '#fef3c7' : '#1b1410';
          ctx.textAlign = 'center';
          ctx.fillText(bubbleText, bxOff + tw / 2, byOff + 16, tw - 10);
        }

        ctx.restore();
      }

      // 7. Particles (Steam + Action Sparkles)
      for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
        const p = sim.particles[i];
        if (!p.active) continue;
        const alpha = 1 - p.life / p.maxLife;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.restore();
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="kamolon-stage"
      className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden border border-[#5a3d28] bg-[#1b1410]"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-label="Kamolon lokantasi bar sahnasi"
      />
      <div className="hidden sm:block pointer-events-none absolute bottom-2 left-3 text-[11px] text-[#e7d8c3]/85 bg-[#1b1410]/85 px-2 py-0.5 rounded">
        Barista harakati: A / D yoki ← / →
      </div>
    </div>
  );
};
