import React from 'react';
import { PrepMethodId, VesselId } from '../game/types';

interface IngredientVisualProps {
  id: string;
  size?: number;
  className?: string;
}

export const IngredientVisual: React.FC<IngredientVisualProps> = ({
  id,
  size = 44,
  className = '',
}) => {
  const renderArt = () => {
    switch (id) {
      // === QAHVA VA SUT ===
      case 'single_shot_espresso':
        return (
          <g>
            <ellipse cx="32" cy="48" rx="18" ry="4" fill="#d6cbb8" />
            <path d="M18 28 H46 L42 46 C41 48 23 48 22 46 Z" fill="#f5f0e6" stroke="#8c6d4f" strokeWidth="2" />
            <path d="M46 31 C52 31 52 40 44 41" fill="none" stroke="#8c6d4f" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="32" cy="28" rx="14" ry="4" fill="#3b1d0a" />
            <ellipse cx="32" cy="28" rx="11" ry="2.6" fill="#c27a38" />
            <path d="M27 19 Q29 14 27 10 M36 18 Q38 13 36 9" fill="none" stroke="#f5deb3" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
            <text x="32" y="41" textAnchor="middle" fontSize="9" fontWeight="700" fill="#451a03">1x</text>
          </g>
        );
      case 'double_shot_espresso':
        return (
          <g>
            <ellipse cx="32" cy="50" rx="20" ry="4.5" fill="#d6cbb8" />
            <path d="M15 24 H49 L44 48 C43 50 21 50 20 48 Z" fill="#29170b" stroke="#d97706" strokeWidth="2" />
            <path d="M49 28 C56 28 56 39 47 41" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="32" cy="24" rx="17" ry="4.5" fill="#2b1205" />
            <ellipse cx="32" cy="24" rx="13.5" ry="3" fill="#d97706" />
            <path d="M25 16 Q27 11 25 7 M32 15 Q34 10 32 6 M39 16 Q41 11 39 7" fill="none" stroke="#fde68a" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
            <text x="32" y="40" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fef3c7">2x</text>
          </g>
        );
      case 'sut':
        return (
          <g>
            <path d="M22 14 L32 8 L42 14 L44 20 V52 H20 V20 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
            <path d="M20 20 H44" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="24" y="27" width="16" height="16" rx="2" fill="#0284c7" />
            <text x="32" y="38" textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">3.2%</text>
            <rect x="29" y="7" width="6" height="4" rx="1" fill="#0284c7" />
          </g>
        );
      case 'qaymoq_20':
        return (
          <g>
            <path d="M18 22 H44 L47 50 H17 Z" fill="#fffbeb" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />
            <path d="M44 26 C53 26 53 40 46 42" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="31" cy="22" rx="13" ry="3.5" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <text x="32" y="40" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#92400e">20%</text>
          </g>
        );
      case 'kopirtirilgan_qaymoq':
        return (
          <g>
            <path d="M16 46 C14 38 22 36 22 36 C18 29 25 26 27 26 C26 19 32 13 33 10 C35 16 40 20 38 26 C44 27 46 34 42 37 C48 39 48 46 42 49 H20 Z" fill="#fffbeb" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />
            <path d="M22 42 Q32 45 42 42" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
          </g>
        );
      case 'muzqaymoq':
        return (
          <g>
            <circle cx="26" cy="26" r="10" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
            <circle cx="38" cy="26" r="10" fill="#fde68a" stroke="#d97706" strokeWidth="1.8" />
            <circle cx="32" cy="18" r="10" fill="#fffbeb" stroke="#d97706" strokeWidth="1.8" />
            <path d="M19 32 H45 L40 48 H24 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
          </g>
        );
      case 'pechenye':
        return (
          <g>
            <circle cx="28" cy="34" r="13" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <circle cx="39" cy="28" r="11" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
            <circle cx="24" cy="31" r="1.8" fill="#451a03" />
            <circle cx="30" cy="38" r="2" fill="#451a03" />
            <circle cx="38" cy="25" r="1.7" fill="#451a03" />
            <circle cx="43" cy="31" r="1.8" fill="#451a03" />
            <circle cx="36" cy="33" r="1.5" fill="#451a03" />
          </g>
        );

      // === CHOY VA SUVLAR ===
      case 'qora_choy':
        return (
          <g>
            <rect x="16" y="16" width="32" height="36" rx="4" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            <rect x="20" y="23" width="24" height="16" rx="2" fill="#fef3c7" />
            <path d="M27 31 Q32 25 37 31 Q32 37 27 31 Z" fill="#451a03" />
            <text x="32" y="48" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fde68a">QORA CHOY</text>
          </g>
        );
      case 'earl_grey_paket':
        return (
          <g>
            <path d="M20 24 L25 18 H39 L44 24 V50 H20 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
            <rect x="22" y="30" width="20" height="16" rx="1" fill="#78350f" opacity="0.85" />
            <path d="M32 18 C32 10 46 10 46 20" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
            <rect x="42" y="19" width="9" height="11" rx="1.5" fill="#1e3a8a" stroke="#93c5fd" strokeWidth="1.2" />
          </g>
        );
      case 'earl_grey_barg':
        return (
          <g>
            <path d="M14 36 C14 48 50 48 50 36 Z" fill="#451a03" stroke="#d97706" strokeWidth="2" />
            <path d="M20 35 C22 25 30 22 32 30 C35 21 44 24 44 35" fill="#29170b" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="28" cy="29" r="2" fill="#60a5fa" />
            <circle cx="37" cy="30" r="2" fill="#60a5fa" />
            <text x="32" y="54" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fde68a">5 gr</text>
          </g>
        );
      case 'jasmin_choyi':
        return (
          <g>
            <path d="M15 38 C15 49 49 49 49 38 Z" fill="#365314" stroke="#a3e635" strokeWidth="2" />
            <circle cx="26" cy="29" r="4" fill="#fefce8" />
            <circle cx="38" cy="28" r="4" fill="#fefce8" />
            <circle cx="32" cy="22" r="4.5" fill="#ffffff" />
            <circle cx="32" cy="22" r="1.5" fill="#facc15" />
            <circle cx="26" cy="29" r="1.3" fill="#facc15" />
            <circle cx="38" cy="28" r="1.3" fill="#facc15" />
          </g>
        );
      case 'muzli_choy_konsentrat':
        return (
          <g>
            <path d="M24 12 H40 L43 22 V52 H21 V22 Z" fill="#b45309" stroke="#fcd34d" strokeWidth="2" strokeLinejoin="round" />
            <rect x="26" y="7" width="12" height="5" rx="1.5" fill="#78350f" />
            <rect x="22" y="28" width="20" height="14" fill="#fef3c7" />
            <text x="32" y="38" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#78350f">ICE TEA</text>
          </g>
        );
      case 'qaynoq_suv':
        return (
          <g>
            <path d="M16 24 H44 L41 50 H19 Z" fill="#7dd3fc" fillOpacity="0.45" stroke="#e0f2fe" strokeWidth="2" />
            <path d="M18 32 Q25 29 31 32 T42 32 L40 49 H20 Z" fill="#38bdf8" fillOpacity="0.6" />
            <path d="M23 19 Q26 13 23 8 M32 18 Q35 12 32 7 M40 19 Q43 13 40 8" fill="none" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'suv':
        return (
          <g>
            <path d="M18 18 H46 L42 52 H22 Z" fill="#bae6fd" fillOpacity="0.35" stroke="#7dd3fc" strokeWidth="2" />
            <path d="M20 30 Q26 27 32 30 T44 30 L41 50 H23 Z" fill="#0ea5e9" fillOpacity="0.7" />
          </g>
        );
      case 'gazli_suv':
        return (
          <g>
            <path d="M25 10 H39 L42 20 V52 H22 V20 Z" fill="#0284c7" fillOpacity="0.75" stroke="#bae6fd" strokeWidth="2" />
            <rect x="27" y="6" width="10" height="4" rx="1" fill="#38bdf8" />
            <circle cx="29" cy="30" r="2" fill="#e0f2fe" />
            <circle cx="35" cy="36" r="2.2" fill="#e0f2fe" />
            <circle cx="30" cy="43" r="1.8" fill="#e0f2fe" />
            <circle cx="36" cy="25" r="1.5" fill="#e0f2fe" />
          </g>
        );
      case 'muz':
        return (
          <g>
            <rect x="14" y="24" width="18" height="18" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" transform="rotate(-10 23 33)" />
            <rect x="29" y="16" width="18" height="18" rx="3" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2" transform="rotate(12 38 25)" />
            <rect x="25" y="31" width="18" height="18" rx="3" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="2" />
            <path d="M29 35 L34 35 L29 40 Z" fill="#ffffff" />
          </g>
        );

      // === MEVA VA KO'KATLAR ===
      case 'olma':
        return (
          <g>
            <path d="M32 20 C22 16 12 24 14 37 C16 48 25 53 32 49 C39 53 48 48 50 37 C52 24 42 16 32 20 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
            <path d="M32 20 Q33 12 37 9" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M34 15 Q44 10 46 17 Q39 20 34 15 Z" fill="#22c55e" />
            <ellipse cx="23" cy="29" rx="3" ry="6" fill="#fca5a5" opacity="0.5" transform="rotate(-15 23 29)" />
          </g>
        );
      case 'limon':
        return (
          <g>
            <circle cx="32" cy="32" r="19" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="32" cy="32" r="15" fill="#fef08a" />
            <circle cx="32" cy="32" r="12.5" fill="#fde047" />
            {[0, 45, 90, 135].map((deg) => (
              <line key={deg} x1="32" y1="19" x2="32" y2="45" stroke="#fef9c3" strokeWidth="2" transform={`rotate(${deg} 32 32)`} />
            ))}
          </g>
        );
      case 'apelsin':
        return (
          <g>
            <circle cx="32" cy="32" r="19" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
            <circle cx="32" cy="32" r="15.5" fill="#ffedd5" />
            <circle cx="32" cy="32" r="13" fill="#f97316" />
            {[0, 45, 90, 135].map((deg) => (
              <line key={deg} x1="32" y1="19" x2="32" y2="45" stroke="#ffedd5" strokeWidth="2" transform={`rotate(${deg} 32 32)`} />
            ))}
          </g>
        );
      case 'apelsin_zedra':
        return (
          <g>
            <path d="M16 42 C18 24 30 16 42 18 C48 19 46 28 38 28 C30 28 28 38 35 42 C41 46 48 40 48 34" fill="none" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
            <path d="M16 42 C18 24 30 16 42 18" fill="none" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'laym':
        return (
          <g>
            <circle cx="32" cy="32" r="18" fill="#65a30d" stroke="#365314" strokeWidth="2" />
            <circle cx="32" cy="32" r="14.5" fill="#ecfccb" />
            <circle cx="32" cy="32" r="12" fill="#84cc16" />
            {[0, 45, 90, 135].map((deg) => (
              <line key={deg} x1="32" y1="20" x2="32" y2="44" stroke="#ecfccb" strokeWidth="2" transform={`rotate(${deg} 32 32)`} />
            ))}
          </g>
        );
      case 'kivi':
        return (
          <g>
            <circle cx="32" cy="32" r="18" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <circle cx="32" cy="32" r="15" fill="#84cc16" />
            <ellipse cx="32" cy="32" rx="6" ry="5" fill="#ecfccb" />
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
              <circle key={deg} cx="32" cy="23" r="1.2" fill="#1e293b" transform={`rotate(${deg} 32 32)`} />
            ))}
          </g>
        );
      case 'bodring':
        return (
          <g>
            <circle cx="26" cy="36" r="13" fill="#15803d" stroke="#14532d" strokeWidth="2" />
            <circle cx="26" cy="36" r="10" fill="#bbf7d0" />
            <circle cx="40" cy="24" r="12" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
            <circle cx="40" cy="24" r="9" fill="#dcfce7" />
            <circle cx="40" cy="24" r="2" fill="#86efac" />
            <circle cx="26" cy="36" r="2.2" fill="#86efac" />
          </g>
        );
      case 'yalpiz':
        return (
          <g>
            <path d="M32 50 V26" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 34 C16 32 14 20 26 18 C32 22 32 30 32 34 Z" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" />
            <path d="M32 30 C48 28 50 16 38 14 C32 18 32 26 32 30 Z" fill="#4ade80" stroke="#14532d" strokeWidth="1.5" />
            <path d="M32 24 C24 12 32 8 36 16 C35 21 32 24 32 24 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
          </g>
        );
      case 'ismaloq':
        return (
          <g>
            <path d="M22 46 C14 34 18 14 32 12 C46 14 50 34 42 46 C36 42 28 42 22 46 Z" fill="#15803d" stroke="#052e16" strokeWidth="2" />
            <path d="M32 52 V18 M32 34 L23 26 M32 28 L41 21" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );
      case 'otquloq':
        return (
          <g>
            <path d="M32 52 V14" stroke="#3f6212" strokeWidth="2" />
            <path d="M32 14 C22 18 18 32 22 44 L29 40 L32 45 L35 40 L42 44 C46 32 42 18 32 14 Z" fill="#65a30d" stroke="#365314" strokeWidth="2" strokeLinejoin="round" />
            <path d="M32 16 V42" stroke="#bef264" strokeWidth="1.5" />
          </g>
        );

      // === SIROPLAR VA ASAL ===
      case 'asal':
        return (
          <g>
            <path d="M18 22 H46 L49 48 C49 51 15 51 15 48 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
            <rect x="22" y="14" width="20" height="8" rx="2" fill="#78350f" />
            <path d="M20 26 H44" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            <polygon points="32,31 37,34 37,40 32,43 27,40 27,34" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
          </g>
        );
      case 'shakar_sirop':
      case 'mango_sirop':
      case 'qulupnay_sirop':
      case 'kivi_sirop':
      case 'tarxun_sirop':
      case 'yagodni_sirop':
      case 'meva_sirop':
      case 'apelsin_sirop':
      case 'vanilya_sirop':
      case 'sirop_kofe': {
        const bottleColors: Record<string, { liquid: string; label: string; text: string }> = {
          shakar_sirop: { liquid: '#fef9c3', label: '#475569', text: 'SHAKAR' },
          mango_sirop: { liquid: '#f59e0b', label: '#78350f', text: 'MANGO' },
          qulupnay_sirop: { liquid: '#e11d48', label: '#881337', text: 'QULUP.' },
          kivi_sirop: { liquid: '#65a30d', label: '#365314', text: 'KIVI' },
          tarxun_sirop: { liquid: '#10b981', label: '#064e3b', text: 'TARXUN' },
          yagodni_sirop: { liquid: '#9f1239', label: '#4c0519', text: 'YAGODA' },
          meva_sirop: { liquid: '#f43f5e', label: '#881337', text: 'MEVA' },
          apelsin_sirop: { liquid: '#ea580c', label: '#7c2d12', text: 'APELS.' },
          vanilya_sirop: { liquid: '#fde68a', label: '#78350f', text: 'VANIL' },
          sirop_kofe: { liquid: '#b45309', label: '#451a03', text: 'SIROP' },
        };
        const cfg = bottleColors[id] ?? { liquid: '#f59e0b', label: '#451a03', text: 'SIROP' };
        return (
          <g>
            <rect x="28" y="6" width="8" height="10" rx="1.5" fill="#d97706" />
            <path d="M26 16 H38 L44 26 V52 H20 V26 Z" fill={cfg.liquid} stroke="#fef3c7" strokeWidth="1.8" strokeLinejoin="round" />
            <rect x="21" y="30" width="22" height="14" rx="1.5" fill="#ffffff" />
            <text x="32" y="39" textAnchor="middle" fontSize="6.2" fontWeight="800" fill={cfg.label}>{cfg.text}</text>
          </g>
        );
      }

      // === PYURELAR ===
      case 'zanjabil_pyure':
      case 'mango_pyure':
      case 'marakuya_pyure':
      case 'malina_pyure':
      case 'qulupnay_pyure':
      case 'kivi_pyure': {
        const pureeColors: Record<string, { fill: string; rim: string; txt: string }> = {
          zanjabil_pyure: { fill: '#eab308', rim: '#854d0e', txt: 'ZANJ.' },
          mango_pyure: { fill: '#f59e0b', rim: '#9a3412', txt: 'MANGO' },
          marakuya_pyure: { fill: '#d97706', rim: '#78350f', txt: 'MARAK.' },
          malina_pyure: { fill: '#be123c', rim: '#881337', txt: 'MALINA' },
          qulupnay_pyure: { fill: '#dc2626', rim: '#7f1d1d', txt: 'QULUP.' },
          kivi_pyure: { fill: '#84cc16', rim: '#3f6212', txt: 'KIVI' },
        };
        const p = pureeColors[id] ?? { fill: '#f59e0b', rim: '#78350f', txt: 'PYURE' };
        return (
          <g>
            <path d="M16 26 H48 L44 50 H20 Z" fill={p.fill} stroke={p.rim} strokeWidth="2" strokeLinejoin="round" />
            <ellipse cx="32" cy="26" rx="16" ry="4.5" fill="#fef3c7" stroke={p.rim} strokeWidth="1.8" />
            <ellipse cx="32" cy="26" rx="12" ry="2.8" fill={p.fill} />
            <rect x="21" y="34" width="22" height="10" rx="2" fill="#ffffff" opacity="0.92" />
            <text x="32" y="41" textAnchor="middle" fontSize="6" fontWeight="800" fill={p.rim}>{p.txt}</text>
          </g>
        );
      }

      // === SHARBAT VA FRESHLAR ===
      case 'olcha_sok':
      case 'apelsin_sok':
      case 'ananas_sok':
      case 'olma_sok':
      case 'limon_fresh':
      case 'lavlagi_fresh': {
        const juiceColors: Record<string, { bg: string; stripe: string; lbl: string }> = {
          olcha_sok: { bg: '#881337', stripe: '#fda4af', lbl: 'OLCHA' },
          apelsin_sok: { bg: '#ea580c', stripe: '#fed7aa', lbl: 'APELS.' },
          ananas_sok: { bg: '#eab308', stripe: '#fef08a', lbl: 'ANANAS' },
          olma_sok: { bg: '#ca8a04', stripe: '#fef3c7', lbl: 'OLMA' },
          limon_fresh: { bg: '#fde047', stripe: '#ffffff', lbl: 'FRESH' },
          lavlagi_fresh: { bg: '#9d174d', stripe: '#fbcfe8', lbl: 'LAVL.' },
        };
        const j = juiceColors[id] ?? { bg: '#ea580c', stripe: '#ffffff', lbl: 'SOK' };
        return (
          <g>
            <path d="M18 16 H46 L42 52 H22 Z" fill={j.bg} stroke="#fef3c7" strokeWidth="2" strokeLinejoin="round" />
            <ellipse cx="32" cy="16" rx="14" ry="3.5" fill={j.stripe} />
            <rect x="22" y="28" width="20" height="12" rx="2" fill="#ffffff" opacity="0.9" />
            <text x="32" y="36.5" textAnchor="middle" fontSize="6.2" fontWeight="800" fill={j.bg}>{j.lbl}</text>
          </g>
        );
      }

      // === ZIRAVOR VA QURUQ MEVA ===
      case 'dolchin_chopcha':
        return (
          <g>
            <rect x="14" y="24" width="36" height="8" rx="4" fill="#9a3412" stroke="#431407" strokeWidth="1.8" transform="rotate(-18 32 28)" />
            <rect x="16" y="34" width="36" height="8" rx="4" fill="#b45309" stroke="#431407" strokeWidth="1.8" transform="rotate(14 34 38)" />
          </g>
        );
      case 'maydalangan_dolchin':
      case 'maydalangan_zanjabil': {
        const powderColor = id === 'maydalangan_dolchin' ? '#9a3412' : '#d97706';
        return (
          <g>
            <path d="M14 34 H50 C48 48 16 48 14 34 Z" fill="#e7e5e4" stroke="#78716c" strokeWidth="2" />
            <path d="M18 34 Q32 16 46 34 Z" fill={powderColor} />
          </g>
        );
      }
      case 'chinnigul':
        return (
          <g>
            <line x1="22" y1="42" x2="30" y2="24" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="31" cy="22" r="4" fill="#78350f" />
            <line x1="36" y1="44" x2="42" y2="26" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="43" cy="24" r="4" fill="#78350f" />
          </g>
        );
      case 'badyan':
        return (
          <g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <ellipse key={deg} cx="32" cy="18" rx="4" ry="11" fill="#78350f" stroke="#451a03" strokeWidth="1.5" transform={`rotate(${deg} 32 32)`} />
            ))}
            <circle cx="32" cy="32" r="4.5" fill="#d97706" />
          </g>
        );
      case 'kardamon':
        return (
          <g>
            <ellipse cx="25" cy="34" rx="7" ry="11" fill="#84cc16" stroke="#3f6212" strokeWidth="2" transform="rotate(-20 25 34)" />
            <ellipse cx="39" cy="29" rx="7" ry="11" fill="#65a30d" stroke="#365314" strokeWidth="2" transform="rotate(22 39 29)" />
          </g>
        );
      case 'muskat_yongogi':
        return (
          <g>
            <ellipse cx="32" cy="32" rx="14" ry="17" fill="#854d0e" stroke="#422006" strokeWidth="2" transform="rotate(20 32 32)" />
            <path d="M24 25 Q32 32 40 27 M22 35 Q32 40 41 34" fill="none" stroke="#d97706" strokeWidth="1.5" />
          </g>
        );
      case 'murch':
        return (
          <g>
            <circle cx="24" cy="36" r="5.5" fill="#292524" stroke="#0c0a09" strokeWidth="1.5" />
            <circle cx="36" cy="38" r="5.5" fill="#1c1917" stroke="#0c0a09" strokeWidth="1.5" />
            <circle cx="31" cy="25" r="5.5" fill="#44403c" stroke="#0c0a09" strokeWidth="1.5" />
            <circle cx="42" cy="27" r="4.5" fill="#292524" stroke="#0c0a09" strokeWidth="1.5" />
          </g>
        );
      case 'quritilgan_qovun':
        return (
          <g>
            <path d="M16 40 C18 22 36 16 48 22 C44 36 30 44 16 40 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
            <path d="M20 35 C24 26 35 22 42 24" fill="none" stroke="#fef3c7" strokeWidth="2" />
          </g>
        );
      case 'quritilgan_olma':
        return (
          <g>
            <circle cx="28" cy="34" r="13" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
            <circle cx="28" cy="34" r="4" fill="#1b1410" />
            <circle cx="40" cy="26" r="11" fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
            <circle cx="40" cy="26" r="3.5" fill="#1b1410" />
          </g>
        );
      case 'mayiz':
        return (
          <g>
            <ellipse cx="22" cy="34" rx="5" ry="7" fill="#581c87" stroke="#3b0764" strokeWidth="1.5" transform="rotate(-15 22 34)" />
            <ellipse cx="32" cy="26" rx="5" ry="7" fill="#6b21a8" stroke="#3b0764" strokeWidth="1.5" transform="rotate(15 32 26)" />
            <ellipse cx="42" cy="35" rx="5" ry="7" fill="#4c1d95" stroke="#2e1065" strokeWidth="1.5" transform="rotate(30 42 35)" />
            <ellipse cx="31" cy="41" rx="5" ry="6.5" fill="#581c87" stroke="#3b0764" strokeWidth="1.5" />
          </g>
        );
      case 'turshak':
        return (
          <g>
            <circle cx="26" cy="34" r="11" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
            <circle cx="38" cy="28" r="11" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
            <ellipse cx="38" cy="28" rx="4" ry="6" fill="#c2410c" opacity="0.55" />
          </g>
        );
      default:
        return (
          <g>
            <circle cx="32" cy="32" r="16" fill="#d97706" stroke="#fef3c7" strokeWidth="2" />
          </g>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      {renderArt()}
    </svg>
  );
};

export const VesselVisual: React.FC<{ vessel: VesselId; size?: number }> = ({
  vessel,
  size = 28,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      {vessel === 'ayirish' && (
        <g>
          <path d="M12 8 H28 L25 27 H15 Z" fill="#fef3c7" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="2" />
          <path d="M27 12 C33 12 33 22 26 22" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <line x1="20" y1="27" x2="20" y2="34" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="13" y1="34" x2="27" y2="34" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      {vessel === 'xaybol' && (
        <g>
          <rect x="13" y="6" width="14" height="28" rx="2" fill="#bae6fd" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" />
          <line x1="13" y1="29" x2="27" y2="29" stroke="#38bdf8" strokeWidth="2" />
        </g>
      )}
      {vessel === 'xarikey' && (
        <g>
          <path d="M11 8 C11 16 14 21 16 26 H24 C26 21 29 16 29 8 Z" fill="#fde68a" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="2" />
          <line x1="20" y1="26" x2="20" y2="34" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="13" y1="34" x2="27" y2="34" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      {vessel === 'standart' && (
        <g>
          <path d="M12 10 H28 L25 32 H15 Z" fill="#f8fafc" fillOpacity="0.22" stroke="#e2e8f0" strokeWidth="2" />
        </g>
      )}
    </svg>
  );
};

export const PrepVisual: React.FC<{ prep: PrepMethodId; size?: number }> = ({
  prep,
  size = 26,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      {prep === 'sheyker' && (
        <g>
          <path d="M15 11 H25 L27 33 H13 Z" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M17 6 H23 L25 11 H15 Z" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="1.5" />
        </g>
      )}
      {prep === 'blender' && (
        <g>
          <path d="M13 8 H27 L25 25 H15 Z" fill="#bae6fd" fillOpacity="0.3" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="13" y="25" width="14" height="9" rx="2" fill="#d97706" stroke="#fef3c7" strokeWidth="1.5" />
        </g>
      )}
      {prep === 'oddiy' && (
        <g>
          <circle cx="20" cy="20" r="10" fill="none" stroke="#a8a29e" strokeWidth="2" />
          <path d="M15 20 L19 24 L26 16" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};
