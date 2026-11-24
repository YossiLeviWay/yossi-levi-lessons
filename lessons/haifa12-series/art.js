/* Topic illustrations for the Haifa 12 review series. Sage, peach, cream. */
(() => {
  const F = (inner, label) =>
    `<svg class="art" viewBox="0 0 640 360" role="img" aria-label="${label}"><rect width="640" height="360" rx="16" fill="#f6f1e7"/>${inner}</svg>`;
  const sage = '#7d9a86';
  const deep = '#526d61';
  const peach = '#e7b39a';
  const ink = '#29332e';
  const person = (x, y, s, shirt) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <circle cx="0" cy="0" r="18" fill="#f3d2b8"/>
      <path d="M-16 8 Q0 22 16 8" fill="${ink}" opacity=".15"/>
      <rect x="-16" y="20" width="32" height="36" rx="10" fill="${shirt || sage}"/>
      <rect x="-7" y="54" width="6" height="22" rx="3" fill="${deep}"/>
      <rect x="1" y="54" width="6" height="22" rx="3" fill="${deep}"/>
    </g>`;
  const child = (x, y, s, shirt) => person(x, y, s * 0.72, shirt || peach);
  const windowLite = (x, y) => `<rect x="${x}" y="${y}" width="54" height="40" rx="4" fill="#d7e4dc" stroke="${deep}" stroke-width="3"/>`;

  window.HAI_ART = {
    notebook: F(windowLite(40, 40) + person(250, 90, 1.3) + child(400, 130, 1) +
      `<rect x="210" y="230" width="150" height="100" rx="8" fill="#fff" stroke="${deep}" stroke-width="3"/>
       <path d="M230 255 h110 M230 275 h90 M230 295 h70" stroke="${peach}" stroke-width="4"/>`, 'תומכת ומחברת ליד ילד'),
    boards: F(`<rect x="40" y="50" width="250" height="250" rx="12" fill="#efe6c9" stroke="${deep}" stroke-width="3"/>
      <rect x="350" y="50" width="250" height="250" rx="12" fill="#fff" stroke="${deep}" stroke-width="3"/>
      <rect x="70" y="80" width="70" height="36" rx="4" fill="${peach}" opacity=".7"/>
      <rect x="150" y="90" width="80" height="30" rx="4" fill="${sage}" opacity=".45"/>
      <rect x="90" y="150" width="90" height="34" rx="4" fill="${sage}" opacity=".35"/>
      <rect x="380" y="90" width="80" height="36" rx="4" fill="${peach}"/>
      <rect x="470" y="150" width="90" height="40" rx="4" fill="${sage}"/>
      <rect x="390" y="210" width="70" height="32" rx="4" fill="${peach}" opacity=".8"/>`, 'שני לוחות, פתקים ישנים וחדשים'),
    split: F(`<rect x="20" y="30" width="290" height="300" rx="12" fill="#efe8dc"/>
      <rect x="330" y="30" width="290" height="300" rx="12" fill="#e7f0ea"/>
      ${child(120, 150, 1.1)} ${person(230, 120, 1.1)}
      <rect x="70" y="250" width="160" height="16" rx="4" fill="${deep}" opacity=".3"/>
      ${child(430, 160, 1)} ${child(520, 165, 1, '#f2c9a0')} ${person(400, 110, 1)}
      <rect x="380" y="250" width="190" height="18" rx="4" fill="${sage}"/>`, 'שילוב מול הכלה'),
    eyelevel: F(`<rect x="0" y="200" width="640" height="160" fill="#e7efe8"/>
      ${windowLite(500, 40)}
      <rect x="80" y="70" width="220" height="120" rx="6" fill="#fff" stroke="${deep}" opacity=".35"/>
      ${child(160, 150, 1.4)} ${child(280, 155, 1.3, '#f2c9a0')} ${child(400, 158, 1.35)}
      <rect x="40" y="250" width="560" height="18" rx="6" fill="${deep}" opacity=".15"/>`, 'הכיתה מגובה העיניים של ילד יושב'),
    present: F(person(140, 80, 1.2) + child(300, 140, 1.1) + child(430, 145, 1, '#f2c9a0') +
      `<rect x="250" y="230" width="180" height="90" rx="8" fill="${peach}" opacity=".85"/>
       <rect x="270" y="248" width="140" height="50" rx="4" fill="#fff"/>
       <circle cx="520" cy="250" r="28" fill="${sage}"/>`, 'ילדים מציגים דגם'),
    poster: F(child(280, 120, 1.4) +
      `<rect x="360" y="70" width="160" height="200" rx="8" fill="#fff" stroke="${deep}" stroke-width="3"/>
       <circle cx="440" cy="130" r="24" fill="${peach}"/>
       <rect x="390" y="170" width="100" height="12" rx="4" fill="${sage}"/>
       <rect x="390" y="196" width="70" height="12" rx="4" fill="${sage}" opacity=".6"/>
       ${person(120, 140, 1)}`, 'ילדה מצביעה על כרזה'),
    line: F(`<rect x="40" y="250" width="560" height="8" rx="4" fill="${deep}"/>
      <ellipse cx="120" cy="268" rx="22" ry="10" fill="${ink}"/>
      <ellipse cx="250" cy="268" rx="22" ry="10" fill="${peach}"/>
      <ellipse cx="390" cy="268" rx="22" ry="10" fill="${sage}"/>
      <ellipse cx="520" cy="268" rx="22" ry="10" fill="${ink}" opacity=".7"/>
      ${windowLite(500, 40)}`, 'קו על רצפת הכיתה'),
    tea: F(`<rect x="0" y="180" width="640" height="180" fill="#e4efe6"/>
      <rect x="180" y="40" width="280" height="160" rx="6" fill="#d5e6dc" stroke="${deep}"/>
      <rect x="250" y="210" width="140" height="16" fill="${deep}" opacity=".3"/>
      <path d="M300 120 h70 v40 a20 20 0 0 1 -70 0 z" fill="#fff" stroke="${deep}" stroke-width="3"/>
      <path d="M370 135 h16 a12 12 0 0 1 0 24 h-16" fill="none" stroke="${deep}" stroke-width="3"/>
      <path d="M318 108 q16 -18 34 0" fill="none" stroke="${sage}" stroke-width="3"/>`, 'כוס תה על אדן החלון'),
    committee: F(`<rect x="80" y="180" width="480" height="24" rx="6" fill="${deep}" opacity=".25"/>
      ${person(160, 70, 1.1)} ${person(300, 60, 1.15, peach)} ${person(440, 70, 1.1)}
      <rect x="360" y="200" width="70" height="50" rx="4" fill="#fff" stroke="${deep}"/>`, 'שולחן ועדה'),
    calendar: F(`<rect x="140" y="40" width="360" height="280" rx="12" fill="#fff" stroke="${deep}" stroke-width="3"/>
      <rect x="140" y="40" width="360" height="50" fill="${sage}"/>
      ${[0,1,2].map(i => `<circle cx="${230 + i * 90}" cy="180" r="28" fill="${i === 2 ? peach : '#e7efe8'}" stroke="${deep}"/>`).join('')}
      <text x="320" y="250" text-anchor="middle" font-size="22" fill="${deep}" font-family="Arial">3</text>`, 'לוח של שלוש שנים'),
    boxes: F(`<rect x="40" y="80" width="560" height="12" fill="${deep}"/>
      <rect x="90" y="200" width="70" height="70" fill="${peach}"/>
      <rect x="270" y="160" width="70" height="110" fill="${sage}"/>
      <rect x="450" y="120" width="70" height="150" fill="${peach}" opacity=".8"/>
      ${child(125, 110, 1)} ${child(305, 70, 1)} ${child(485, 30, 1, '#f2c9a0')}
      <path d="M70 92 h500" stroke="${sage}" stroke-width="4" stroke-dasharray="6 6"/>`, 'שלושה ילדים רואים מעל הגדר'),
    objects: F(`<rect x="60" y="80" width="520" height="220" rx="16" fill="#efe6d4"/>
      <rect x="100" y="140" width="50" height="24" rx="4" fill="${peach}"/>
      <circle cx="220" cy="160" r="22" fill="#fff" stroke="${deep}" stroke-width="4"/>
      <rect x="280" y="145" width="54" height="22" rx="8" fill="${sage}"/>
      <path d="M390 120 v70" stroke="${deep}" stroke-width="4"/>
      <path d="M370 140 q20 30 40 0" fill="${peach}" opacity=".8"/>
      <path d="M470 150 h50 v20 h-20 v30 h-10 v-30 h-20 z" fill="${sage}"/>
      <circle cx="160" cy="220" r="16" fill="none" stroke="${deep}" stroke-width="4"/>`, 'שישה חפצים על שולחן'),
    day: F(`<path d="M40 220 H600" stroke="${deep}" stroke-width="4"/>
      ${[['ספר',80],['כדור',220],['אוכל',360],['דרך',500]].map(([t,x],i) => `
        <circle cx="${x}" cy="220" r="10" fill="${peach}"/>
        <rect x="${x-28}" y="${80+ (i%2)*20}" width="56" height="40" rx="8" fill="${i%2?sage:'#fff'}" stroke="${deep}"/>
      `).join('')}`, 'ציר של יום: שיעור, הפסקה, ארוחה, יציאה'),
    phone: F(`<rect x="210" y="30" width="220" height="300" rx="24" fill="#29332e"/>
      <rect x="224" y="58" width="192" height="240" rx="8" fill="#f6f1e7"/>
      <rect x="240" y="90" width="160" height="120" rx="12" fill="#fff" stroke="${sage}"/>
      <circle cx="320" cy="270" r="10" fill="${peach}"/>`, 'מסך טלפון עם הודעה'),
    envelope: F(`<rect x="140" y="90" width="360" height="200" rx="8" fill="#fff" stroke="${deep}" stroke-width="3"/>
      <path d="M140 90 L320 200 L500 90" fill="none" stroke="${peach}" stroke-width="4"/>
      <rect x="430" y="200" width="36" height="28" rx="6" fill="${sage}"/>
      <path d="M438 214 h20" stroke="#fff" stroke-width="3"/>`, 'מעטפה נעולה עוברת בין ידיים'),
    badge: F(person(250, 70, 1.6) +
      `<rect x="360" y="150" width="120" height="70" rx="10" fill="#fff" stroke="${deep}" stroke-width="3"/>
       <path d="M380 175 h80 M380 195 h50" stroke="${peach}" stroke-width="4"/>`, 'תומכת כותבת תג שם'),
    marks: F(`<rect x="160" y="40" width="320" height="280" rx="10" fill="#fff" stroke="${deep}" stroke-width="3"/>
      <rect x="190" y="70" width="40" height="200" fill="${peach}"/>
      <rect x="250" y="70" width="40" height="200" fill="${sage}" opacity=".7"/>
      <rect x="310" y="70" width="40" height="200" fill="${peach}" opacity=".5"/>
      <rect x="370" y="70" width="40" height="200" fill="${sage}"/>`, 'מחברת עם סימניות'),
    lace: F(person(180, 60, 1.3) + child(360, 110, 1.2) +
      `<path d="M300 250 q40 30 80 -10" fill="none" stroke="${deep}" stroke-width="4"/>
       <circle cx="300" cy="250" r="8" fill="${peach}"/>
       <circle cx="380" cy="240" r="8" fill="${sage}"/>`, 'שרוך בין יד מבוגרת ליד ילד'),
    signs: F(`<path d="M40 280 Q200 200 320 240 T600 180" fill="none" stroke="${sage}" stroke-width="8"/>
      <rect x="80" y="80" width="90" height="50" rx="6" fill="#fff" stroke="${deep}"/>
      <rect x="270" y="50" width="90" height="50" rx="6" fill="${peach}"/>
      <rect x="460" y="90" width="90" height="50" rx="6" fill="${sage}"/>`, 'שלושה שלטי דרך'),
    clock: F(`<circle cx="160" cy="150" r="70" fill="#fff" stroke="${deep}" stroke-width="6"/>
      <path d="M160 150 L160 100 M160 150 L200 160" stroke="${ink}" stroke-width="4"/>
      <ellipse cx="430" cy="250" rx="120" ry="28" fill="${sage}" opacity=".45"/>
      ${child(400, 120, 1.3)}`, 'שעון בגן וילדה על השטיח'),
    glass: F(`<ellipse cx="220" cy="200" rx="70" ry="40" fill="#d5e6dc" stroke="${deep}" stroke-width="4"/>
      <rect x="360" y="140" width="120" height="80" rx="6" fill="#fff" stroke="${peach}" stroke-width="3"/>
      <text x="420" y="188" text-anchor="middle" font-size="28" fill="${deep}" font-family="Arial">?</text>`, 'מגדלת ופתק של שאלה'),
    door: F(`<rect x="200" y="40" width="220" height="280" rx="6" fill="#efe6d4" stroke="${deep}" stroke-width="4"/>
      <rect x="360" y="170" width="16" height="16" rx="4" fill="${peach}"/>
      <path d="M200 40 L250 70 L250 300" fill="#fff" opacity=".5" stroke="${deep}"/>`, 'דלת חדר המנהלת פתוחה מעט'),
    flow: F([0,1,2,3].map(i => `
      <rect x="${40+i*150}" y="140" width="120" height="70" rx="12" fill="${i%2?peach:'#fff'}" stroke="${deep}" stroke-width="3"/>
      ${i<3?`<path d="M${165+i*150} 175 h20" stroke="${sage}" stroke-width="4" marker-end="url(#a)"/>`:''}
    `).join('') + `<defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="${sage}"/></marker></defs>`, 'מסלול של ארבעה צעדים'),
    respect: F(child(250, 150, 1.2) + person(400, 90, 1.3) +
      `<path d="M300 250 q40 20 70 0" fill="none" stroke="${sage}" stroke-width="3"/>`, 'תומכת כורעת לגובה של ילד'),
    drive: F(`<rect x="80" y="160" width="420" height="90" rx="16" fill="${sage}"/>
      <circle cx="180" cy="250" r="28" fill="${ink}"/>
      <circle cx="420" cy="250" r="28" fill="${ink}"/>
      ${person(200, 70, 1)} ${child(360, 100, 1)}`, 'ללמוד משהו חדש, וילד לידה'),
    choose: F(`<rect x="80" y="160" width="480" height="16" fill="${deep}" opacity=".2"/>
      <rect x="160" y="90" width="70" height="90" rx="8" fill="${peach}"/>
      <rect x="400" y="90" width="70" height="90" rx="8" fill="${sage}"/>
      ${child(300, 80, 1.3)}`, 'בחירה בין שתי אפשרויות'),
    domains: F(`<circle cx="320" cy="190" r="46" fill="${peach}"/>
      <circle cx="140" cy="100" r="28" fill="${sage}"/>
      <circle cx="500" cy="100" r="28" fill="#fff" stroke="${deep}" stroke-width="3"/>
      <circle cx="150" cy="280" r="28" fill="#fff" stroke="${peach}" stroke-width="4"/>
      <circle cx="500" cy="270" r="28" fill="${sage}" opacity=".7"/>
      ${child(320, 130, 1)}`, 'ילד וארבעה תחומים סביבו'),
    hop: F(`<rect x="40" y="200" width="560" height="80" fill="#e7efe8"/>
      ${[0,1,2,3,4].map(i => `<rect x="${70+i*110}" y="170" width="80" height="70" fill="none" stroke="${deep}" stroke-width="3"/>`).join('')}
      ${child(200, 60, 1.2)}`, 'קפיצה על משבצות'),
    steps: F([0,1,2].map(i => `
      <rect x="${80+i*180}" y="${200-i*30}" width="120" height="${40+i*20}" fill="${i===1?peach:sage}" opacity=".8"/>
    `).join('') + child(140, 80, 1), 'שלבים: זחילה, הליכה, ריצה'),
    ears: F(windowLite(480, 40) + child(180, 100, 1.4) + child(400, 120, 1.2, '#f2c9a0') +
      `<path d="M150 150 q-20 -30 10 -40" fill="none" stroke="${ink}" stroke-width="3"/>
       <path d="M210 150 q20 -30 -10 -40" fill="none" stroke="${ink}" stroke-width="3"/>`, 'ילד מכסה אוזניים וילד מתנדנד'),
    wait: F(person(180, 70, 1.3) + child(380, 120, 1.2) +
      `<rect x="340" y="200" width="70" height="50" rx="6" fill="#fff" stroke="${peach}" stroke-width="3"/>`, 'תומכת מחכה לילד שמצביע על כרטיס'),
    chalk: F(`<rect x="40" y="200" width="560" height="100" fill="#d9e3da"/>
      <text x="300" y="160" text-anchor="middle" font-size="90" fill="${deep}" font-family="Arial">?</text>
      <rect x="460" y="230" width="40" height="10" rx="3" fill="#fff"/>`, 'סימן שאלה על המדרכה'),
    iceberg: F(`<path d="M0 170 H640" stroke="${sage}" stroke-width="3"/>
      <path d="M250 170 L320 60 L400 170 Z" fill="#fff" stroke="${deep}"/>
      <path d="M180 170 L320 320 L470 170 Z" fill="#d5e6dc" opacity=".9"/>
      ${child(300, 70, .7)}
      <circle cx="120" cy="230" r="22" fill="${peach}" opacity=".6"/>
      <rect x="430" y="210" width="50" height="30" rx="6" fill="${sage}"/>`, 'קרחון: מה שרואים ומה שמתחת'),
    glasses: F(`<circle cx="180" cy="180" r="50" fill="none" stroke="${peach}" stroke-width="8"/>
      <circle cx="320" cy="180" r="50" fill="none" stroke="${sage}" stroke-width="8"/>
      <circle cx="460" cy="180" r="50" fill="none" stroke="${deep}" stroke-width="8"/>
      <path d="M230 180 H270 M370 180 H410" stroke="${ink}" stroke-width="4"/>`, 'שלושה זוגות משקפיים'),
    tiles: F([0,1,2,3,4,5,6,7].map(i => {
      const x = 40 + (i%4)*150, y = 40 + Math.floor(i/4)*150;
      return `<rect x="${x}" y="${y}" width="130" height="120" rx="12" fill="${i%2?'#fff':peach}" stroke="${deep}" opacity=".9"/>
        <circle cx="${x+65}" cy="${y+60}" r="18" fill="${sage}"/>`;
    }).join(''), 'שמונה אריחים'),
    tileone: F(`<rect x="180" y="60" width="280" height="240" rx="16" fill="${peach}" stroke="${deep}" stroke-width="4"/>
      <circle cx="320" cy="180" r="40" fill="${sage}"/>`, 'אריח אחד מודגש'),
    shadowbook: F(child(220, 80, 1.5) +
      `<rect x="340" y="150" width="90" height="110" rx="4" fill="#fff" stroke="${deep}"/>
       <path d="M300 280 L420 300 L300 320 Z" fill="${ink}" opacity=".15"/>`, 'ילדה עם ספר וצל'),
    bag: F(`<path d="M220 90 h200 v200 h-200 z" fill="${sage}" rx="10"/>
      <rect x="270" y="60" width="100" height="40" rx="8" fill="${peach}"/>
      <rect x="250" y="140" width="50" height="36" rx="4" fill="#fff"/>
      <circle cx="340" cy="160" r="16" fill="${peach}"/>
      <rect x="380" y="140" width="24" height="40" fill="${deep}"/>
      <rect x="250" y="200" width="140" height="28" rx="4" fill="#fff"/>`, 'תיק גב פתוח עם חפצים'),
    ideas: F(child(180, 100, 1.4) +
      `<circle cx="360" cy="90" r="28" fill="#fff" stroke="${peach}"/>
       <circle cx="430" cy="140" r="22" fill="#fff" stroke="${sage}"/>
       <circle cx="390" cy="190" r="18" fill="#fff" stroke="${deep}"/>
       <rect x="460" y="200" width="100" height="80" rx="4" fill="#fff" stroke="${deep}"/>`, 'רעיונות מעל דף ריק'),
    homework: F(person(180, 70, 1.2, peach) + child(360, 120, 1.2) +
      `<rect x="240" y="230" width="180" height="16" fill="${deep}" opacity=".2"/>
       <rect x="280" y="200" width="80" height="40" fill="#fff" stroke="${sage}"/>`, 'הורה וילד בשיעורי בית'),
    yard: F(`<rect x="0" y="180" width="640" height="180" fill="#d7e8d4"/>
      <rect x="40" y="80" width="16" height="220" fill="${deep}"/>
      ${child(120, 150, 1)}
      <circle cx="150" cy="250" r="16" fill="${peach}"/>
      ${child(360, 140, 1)} ${child(460, 145, 1, '#f2c9a0')} ${child(540, 150, 1)}`, 'חצר, וילד ליד הגדר עם כדור'),
    roles: F([0,1,2,3].map(i => `
      <rect x="${40+i*150}" y="80" width="130" height="180" rx="12" fill="${i%2?'#fff': '#e7efe8'}" stroke="${deep}"/>
      <circle cx="${105+i*150}" cy="150" r="24" fill="${i===3?sage:peach}"/>
    `).join(''), 'ארבעה תפקידים בחצר'),
    bench: F(`<rect x="80" y="220" width="300" height="16" rx="4" fill="${deep}"/>
      <rect x="100" y="236" width="12" height="40" fill="${deep}"/>
      <rect x="340" y="236" width="12" height="40" fill="${deep}"/>
      ${person(160, 90, 1.1)} ${child(280, 120, 1)}
      <circle cx="520" cy="80" r="30" fill="${peach}" opacity=".8"/>`, 'אחרי סערה, על הספסל'),
    volume: F(person(160, 80, 1.3) +
      `<rect x="360" y="140" width="140" height="60" rx="10" fill="${ink}"/>
       <path d="M390 155 h40 M390 175 h70" stroke="${peach}" stroke-width="4"/>
       <circle cx="520" cy="170" r="18" fill="${sage}"/>`, 'הנמכת רמקול'),
    specs: F(`<rect x="180" y="80" width="200" height="140" rx="8" fill="#fff" stroke="${deep}"/>
      <circle cx="460" cy="200" r="40" fill="none" stroke="${peach}" stroke-width="8"/>
      <path d="M490 230 L530 270" stroke="${peach}" stroke-width="8"/>`, 'מחברת ומשקפיים'),
    cup: F(`<path d="M200 140 h80 v50 a30 30 0 0 1 -80 0 z" fill="#fff" stroke="${deep}" stroke-width="3"/>
      <path d="M160 200 q40 40 80 0" fill="none" stroke="${sage}" stroke-width="6"/>
      <path d="M360 160 h70 v40 a20 20 0 0 1 -70 0 z" fill="${peach}" stroke="${deep}"/>`, 'שתי ידיים וכוס'),
    table: F(`<ellipse cx="320" cy="180" rx="180" ry="90" fill="#efe6d4" stroke="${deep}" stroke-width="3"/>
      ${[0,1,2,3,4].map(i => {
        const a = -Math.PI/2 + i * (Math.PI*2/6);
        const x = 320 + Math.cos(a)*150, y = 180 + Math.sin(a)*70;
        return person(x, y-40, 0.7, i%2?peach:sage);
      }).join('')}
      <rect x="430" y="200" width="36" height="28" rx="4" fill="${sage}"/>`, 'שולחן עגול וכיסא עם תיק'),
    path: F(`<path d="M80 300 C 160 200, 240 260, 320 180 S 500 80, 580 120" fill="none" stroke="${sage}" stroke-width="8"/>
      ${person(140, 160, .8, peach)} ${person(300, 80, .8)} ${person(480, 40, .8, peach)}`, 'שביל ועליו הורים במקומות שונים'),
    gate: F(`<rect x="200" y="40" width="20" height="260" fill="${deep}"/>
      <rect x="420" y="40" width="20" height="260" fill="${deep}"/>
      ${person(140, 100, 1.1, peach)} ${person(300, 100, 1.1)}
      <rect x="250" y="200" width="40" height="60" rx="4" fill="${ink}"/>`, 'שיחה בשער בית הספר'),
    handsmap: F(`<circle cx="320" cy="180" r="110" fill="#e7efe8" stroke="${sage}" stroke-width="4"/>
      ${[0,1,2,3,4,5].map(i => {
        const a = i * Math.PI/3;
        return `<circle cx="${320+Math.cos(a)*70}" cy="${180+Math.sin(a)*70}" r="16" fill="${peach}"/>`;
      }).join('')}`, 'מפה מטביעות ידיים'),
    corners: F(`<rect x="20" y="30" width="290" height="300" rx="12" fill="#f3e2d4"/>
      <rect x="330" y="30" width="290" height="300" rx="12" fill="#e7f0ea"/>
      <rect x="40" y="50" width="80" height="50" fill="${peach}"/>
      <rect x="140" y="60" width="60" height="40" fill="${sage}" opacity=".5"/>
      <rect x="50" y="140" width="100" height="30" fill="${deep}" opacity=".2"/>
      <rect x="360" y="70" width="200" height="36" rx="4" fill="#fff" stroke="${deep}"/>
      <rect x="360" y="130" width="40" height="50" fill="${sage}"/>
      <rect x="420" y="130" width="40" height="50" fill="${peach}"/>
      <rect x="480" y="130" width="40" height="50" fill="${sage}" opacity=".6"/>
      <ellipse cx="470" cy="250" rx="40" ry="16" fill="${peach}" opacity=".7"/>`, 'פינה עמוסה מול פינה מסודרת'),
    schedule: F(`<rect x="160" y="40" width="320" height="280" rx="12" fill="#fff" stroke="${deep}" stroke-width="3"/>
      ${[0,1,2,3].map(i => `<rect x="190" y="${70+i*58}" width="70" height="44" rx="6" fill="${i%2?peach:sage}"/>
        <rect x="280" y="${82+i*58}" width="160" height="16" rx="4" fill="#e7efe8"/>`).join('')}`, 'לוח תמונות'),
    methods: F([0,1,2,3].map(i => `
      <rect x="${40+i*150}" y="90" width="130" height="160" rx="16" fill="${i%2?'#fff':'#e7efe8'}" stroke="${deep}"/>
      <circle cx="${105+i*150}" cy="160" r="26" fill="${[peach,sage,peach,sage][i]}"/>
    `).join(''), 'ארבע שיטות'),
    arrows: F(person(300, 80, 1.3) +
      `<path d="M80 220 H240" stroke="${peach}" stroke-width="8"/>
       <path d="M560 220 H400" stroke="${sage}" stroke-width="8"/>
       <path d="M240 200 L270 220 L240 240" fill="${peach}"/>
       <path d="M400 200 L370 220 L400 240" fill="${sage}"/>`, 'תומכת בין שני חצים'),
    simplify: F(`<rect x="60" y="70" width="200" height="220" rx="6" fill="#fff" stroke="${deep}"/>
      ${[0,1,2,3,4,5].map(i => `<rect x="80" y="${90+i*28}" width="${160-i*8}" height="10" fill="${sage}" opacity=".5"/>`).join('')}
      <path d="M280 170 H360" stroke="${peach}" stroke-width="6"/>
      <rect x="380" y="110" width="180" height="140" rx="10" fill="${peach}" opacity=".85"/>
      <circle cx="470" cy="160" r="22" fill="#fff"/>
      <rect x="420" y="200" width="100" height="12" rx="4" fill="#fff"/>`, 'מסמך ארוך הופך לכרטיס'),
    energy: F(`<path d="M60 280 H580 M80 40 V300" stroke="${deep}" stroke-width="3"/>
      <path d="M80 200 C 160 200, 180 80, 260 120 S 400 260, 520 90" fill="none" stroke="${peach}" stroke-width="6"/>
      <rect x="40" y="300" width="560" height="30" fill="#e7efe8"/>`, 'גרף אנרגיה לאורך היום'),
    candle: F(`<rect x="290" y="150" width="50" height="120" rx="6" fill="${peach}"/>
      <path d="M315 150 Q300 110 320 80 Q340 110 315 150" fill="${sage}"/>
      <path d="M160 220 h80 v40 a30 30 0 0 1 -80 0 z" fill="#fff" stroke="${deep}" stroke-width="3"/>`, 'נר וכוס תה'),
    thanks: F(child(180, 120, 1.3) + person(340, 80, 1.3) + person(480, 90, 1.2, peach) +
      `<circle cx="120" cy="80" r="20" fill="${sage}" opacity=".5"/>`, 'ילד, צוות ותומכת'),
    map18: F([0,1,2,3,4,5,6,7,8].map(i => {
      const x = 30 + (i%5)*122, y = 40 + Math.floor(i/5)*150;
      return `<rect x="${x}" y="${y}" width="110" height="120" rx="10" fill="${i%2?peach:'#fff'}" stroke="${deep}"/>`;
    }).join(''), 'אריחי הנושאים'),
  };
})();
