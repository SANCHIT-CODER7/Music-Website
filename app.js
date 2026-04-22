// ============================================
//  Melodix — Music Player JavaScript
//  Data Structure: Linked List (C++ simulation)
// ============================================

// ─── SONG DATABASE ───────────────────────────
const SONGS = [
  { id:1,  title:"Blinding Lights",    artist:"The Weeknd",      album:"After Hours",                genre:"pop",        dur:"3:20", emoji:"🌃", color:"#1a1a3e" },
  { id:2,  title:"HUMBLE.",            artist:"Kendrick Lamar",  album:"DAMN.",                      genre:"hip-hop",    dur:"2:57", emoji:"👑", color:"#1a0a0a" },
  { id:3,  title:"Shape of You",       artist:"Ed Sheeran",      album:"÷ (Divide)",                 genre:"pop",        dur:"3:53", emoji:"💚", color:"#0a1a0a" },
  { id:4,  title:"Bohemian Rhapsody",  artist:"Queen",           album:"A Night at the Opera",       genre:"rock",       dur:"5:55", emoji:"🎸", color:"#1a100a" },
  { id:5,  title:"One More Time",      artist:"Daft Punk",       album:"Discovery",                  genre:"electronic", dur:"5:20", emoji:"🤖", color:"#0a0f1a" },
  { id:6,  title:"Levitating",         artist:"Dua Lipa",        album:"Future Nostalgia",           genre:"pop",        dur:"3:24", emoji:"✨", color:"#1a0a1a" },
  { id:7,  title:"SICKO MODE",         artist:"Travis Scott",    album:"Astroworld",                 genre:"hip-hop",    dur:"5:12", emoji:"🌊", color:"#0a0a0a" },
  { id:8,  title:"Thunderstruck",      artist:"AC/DC",           album:"The Razors Edge",            genre:"rock",       dur:"4:52", emoji:"⚡", color:"#1a1a0a" },
  { id:9,  title:"Strobe",             artist:"deadmau5",        album:"For Lack of a Better Name",  genre:"electronic", dur:"10:33",emoji:"🎛️", color:"#050a1a" },
  { id:10, title:"Bad Guy",            artist:"Billie Eilish",   album:"When We All Fall Asleep",    genre:"pop",        dur:"3:14", emoji:"🖤", color:"#0a0a0a" },
  { id:11, title:"God's Plan",         artist:"Drake",           album:"Scorpion",                   genre:"hip-hop",    dur:"3:18", emoji:"🙏", color:"#1a0d0a" },
  { id:12, title:"Stairway to Heaven", artist:"Led Zeppelin",    album:"Led Zeppelin IV",            genre:"rock",       dur:"8:02", emoji:"🎶", color:"#100a0a" },
  { id:13, title:"Midnight City",      artist:"M83",             album:"Hurry Up, We're Dreaming",   genre:"electronic", dur:"4:03", emoji:"🌆", color:"#0a0d1a" },
  { id:14, title:"As It Was",          artist:"Harry Styles",    album:"Harry's House",              genre:"pop",        dur:"2:37", emoji:"🌸", color:"#1a0010" },
  { id:15, title:"MONTERO",            artist:"Lil Nas X",       album:"MONTERO",                    genre:"hip-hop",    dur:"2:18", emoji:"🌈", color:"#1a1a00" },
];

// ─── ALBUM DATABASE ──────────────────────────
const ALBUMS = [
  { name:"After Hours",       artist:"The Weeknd",     emoji:"🌃", color:"#1a1a3e", songs:[1]     },
  { name:"Future Nostalgia",  artist:"Dua Lipa",       emoji:"✨", color:"#1a0a1a", songs:[6]     },
  { name:"DAMN.",             artist:"Kendrick Lamar", emoji:"👑", color:"#1a0a0a", songs:[2,11]  },
  { name:"Discovery",         artist:"Daft Punk",      emoji:"🤖", color:"#0a0f1a", songs:[5]     },
  { name:"Harry's House",     artist:"Harry Styles",   emoji:"🌸", color:"#1a0010", songs:[14]    },
  { name:"Led Zeppelin IV",   artist:"Led Zeppelin",   emoji:"🎶", color:"#100a0a", songs:[12]    },
];

// ─── PLAYER STATE ────────────────────────────
let currentTrack    = null;
let isPlaying       = false;
let isShuffle       = false;
let isRepeat        = false;
let likedSongs      = new Set();
let progress        = 0;
let progressTimer   = null;
let currentGenre    = 'all';
let currentSearch   = '';

// ─── LINKED LIST STATE ───────────────────────
let llNodes         = [];
let traverseTimer   = null;

// ════════════════════════════════════════════
//  LINKED LIST — Node class (mirrors C++ struct)
// ════════════════════════════════════════════

class SongNode {
  constructor(song) {
    this.song     = song;
    this.address  = '0x' + Math.floor(Math.random() * 0xEFFF + 0x1000).toString(16).toUpperCase();
    this.nextAddr = null;
  }
}

// Insert at front — O(1)
function llAddFront(song) {
  const node    = new SongNode(song);
  node.nextAddr = llNodes.length > 0 ? llNodes[0].address : null;
  llNodes.unshift(node);
  updateNextPointers();
  return node;
}

// Insert at back — O(n)
function llAddBack(song) {
  const node = new SongNode(song);
  if (llNodes.length > 0) {
    llNodes[llNodes.length - 1].nextAddr = node.address;
  }
  llNodes.push(node);
  return node;
}

// Remove from front — O(1)
function llRemoveHead() {
  if (llNodes.length === 0) return null;
  const removed = llNodes.shift();
  updateNextPointers();
  return removed;
}

// Remove from back — O(n)
function llRemoveTail() {
  if (llNodes.length === 0) return null;
  const removed = llNodes.pop();
  if (llNodes.length > 0) {
    llNodes[llNodes.length - 1].nextAddr = null;
  }
  return removed;
}

// Fix all next pointers after structural change
function updateNextPointers() {
  llNodes.forEach((node, i) => {
    node.nextAddr = i < llNodes.length - 1 ? llNodes[i + 1].address : null;
  });
}

// Initialize LL with first 5 songs
function initLL() {
  llNodes = [];
  SONGS.slice(0, 5).forEach(song => llAddBack(song));
  renderLL();
}

// ════════════════════════════════════════════
//  LINKED LIST — Render
// ════════════════════════════════════════════

function renderLL(activeIdx = -1) {
  const chain = document.getElementById('node-chain');
  chain.innerHTML = '';

  llNodes.forEach((node, i) => {
    const isHead   = i === 0;
    const isTail   = i === llNodes.length - 1;
    const isActive = i === activeIdx;

    // Node element
    const nodeEl = document.createElement('div');
    nodeEl.className = 'll-node'
      + (isHead   ? ' head'   : '')
      + (isTail   ? ' tail'   : '')
      + (isActive ? ' active' : '');

    nodeEl.innerHTML = `
      <div class="ll-node-header">
        <span>${isHead ? 'HEAD' : 'Node ' + (i + 1)}</span>
        <span>${node.address}</span>
      </div>
      <div class="ll-node-body">
        <div class="ll-field">
          <div class="ll-field-label">title</div>
          <div class="ll-field-value">${node.song.title}</div>
        </div>
        <div class="ll-field">
          <div class="ll-field-label">artist</div>
          <div class="ll-field-value">${node.song.artist}</div>
        </div>
        <div class="ll-field">
          <div class="ll-field-label">duration</div>
          <div class="ll-field-value">${node.song.dur}</div>
        </div>
      </div>
      <div class="ll-node-footer">next → ${node.nextAddr || 'nullptr'}</div>
    `;
    chain.appendChild(nodeEl);

    // Arrow between nodes
    if (!isTail) {
      const arrow = document.createElement('div');
      arrow.className = 'll-arrow' + (isActive ? ' active-arrow' : '');
      arrow.textContent = '→';
      chain.appendChild(arrow);
    }
  });

  // Null terminator
  const finalArrow = document.createElement('div');
  finalArrow.className = 'll-arrow';
  finalArrow.textContent = '→';
  chain.appendChild(finalArrow);

  const nullEl = document.createElement('div');
  nullEl.className = 'null-node';
  nullEl.innerHTML = 'nullptr<br><span style="font-size:10px">end of list</span>';
  chain.appendChild(nullEl);

  // Also refresh memory diagram
  renderMemDiag();
}

// ════════════════════════════════════════════
//  LINKED LIST — Operations (button handlers)
// ════════════════════════════════════════════

function addNodeToFront() {
  const song = SONGS[Math.floor(Math.random() * SONGS.length)];
  const node = llAddFront(song);
  setLog(`new Song* node = new Song(); // allocated at ${node.address} → inserted at HEAD`);
  renderLL(0);
}

function addNodeToBack() {
  const song = SONGS[Math.floor(Math.random() * SONGS.length)];
  const node = llAddBack(song);
  setLog(`new Song* node = new Song(); // allocated at ${node.address} → appended to TAIL`);
  renderLL(llNodes.length - 1);
}

function removeHead() {
  if (llNodes.length === 0) { setLog('List is empty — nothing to remove'); return; }
  const removed = llRemoveHead();
  setLog(`delete head; // freed memory at ${removed.address} — "${removed.song.title}" removed`);
  renderLL();
}

function removeTail() {
  if (llNodes.length === 0) { setLog('List is empty — nothing to remove'); return; }
  const removed = llRemoveTail();
  setLog(`delete tail; // freed memory at ${removed.address} — "${removed.song.title}" removed`);
  renderLL();
}

function traverseNodes() {
  if (traverseTimer) clearInterval(traverseTimer);
  let i = 0;
  setLog('Traversal started: head → ... → nullptr');
  traverseTimer = setInterval(() => {
    if (i >= llNodes.length) {
      clearInterval(traverseTimer);
      renderLL();
      setLog('Traversal complete ✓  All ' + llNodes.length + ' nodes visited');
      return;
    }
    renderLL(i);
    setLog(`curr = curr->next; // visiting "${llNodes[i].song.title}" at ${llNodes[i].address}`);
    i++;
  }, 700);
}

function resetNodes() {
  if (traverseTimer) clearInterval(traverseTimer);
  initLL();
  setLog('Linked list reset — 5 nodes initialized with new Song()');
}

function setLog(msg) {
  document.getElementById('op-log').textContent = '▶  ' + msg;
}

// ════════════════════════════════════════════
//  MEMORY DIAGRAM
// ════════════════════════════════════════════

function renderMemDiag() {
  const el      = document.getElementById('mem-diag');
  const visible = llNodes.slice(0, 5);
  if (!el) return;

  el.innerHTML = visible.map((n, i) => {
    const isHead = i === 0;
    const isTail = i === visible.length - 1;
    const cellClass = isHead ? 'head-cell' : isTail ? 'tail-cell' : '';
    const nextVal   = n.nextAddr ? n.nextAddr : 'nullptr';
    const nextColor = n.nextAddr ? '#50fa7b' : '#ff5555';

    return `
      <div class="mem-row">
        <div class="mem-addr">${n.address}</div>
        <div class="mem-cell ${cellClass}">
          <span style="color:#8be9fd">Song</span> {
          title=<span style="color:#f1fa8c">"${n.song.title}"</span>,
          artist=<span style="color:#ffb86c">"${n.song.artist}"</span>,
          next=<span style="color:${nextColor}">${nextVal}</span> }
        </div>
      </div>
      ${!isTail ? '<div class="mem-down">↓</div>' : ''}
    `;
  }).join('');
}

// ════════════════════════════════════════════
//  C++ CODE (syntax highlighted HTML)
// ════════════════════════════════════════════

function renderCppCode() {
  const el = document.getElementById('cpp-code');
  if (!el) return;

  el.innerHTML = [
    `<span class="code-c">// ============================================</span>`,
    `<span class="code-c">// Melodix — Dynamic Memory Allocation Project</span>`,
    `<span class="code-c">// Data Structure : Singly Linked List         </span>`,
    `<span class="code-c">// Submitted by   : [Your Name]                </span>`,
    `<span class="code-c">// ============================================</span>`,
    ``,
    `<span class="code-k">#include</span> <span class="code-s">&lt;iostream&gt;</span>`,
    `<span class="code-k">#include</span> <span class="code-s">&lt;string&gt;</span>`,
    `<span class="code-k">using namespace</span> std;`,
    ``,
    `<span class="code-c">// ─── NODE STRUCTURE ───────────────────────────</span>`,
    `<span class="code-c">// Each Song is one node in the linked list.    </span>`,
    `<span class="code-c">// Memory is allocated on the HEAP using new.   </span>`,
    `<span class="code-k">struct</span> <span class="code-t">Song</span> {`,
    `  string  <span class="code-v">title</span>;`,
    `  string  <span class="code-v">artist</span>;`,
    `  string  <span class="code-v">album</span>;`,
    `  string  <span class="code-v">genre</span>;`,
    `  int     <span class="code-v">duration</span>;   <span class="code-c">// in seconds</span>`,
    `  <span class="code-t">Song</span>*   <span class="code-v">next</span>;       <span class="code-c">// pointer to next node</span>`,
    ``,
    `  <span class="code-c">// Constructor</span>`,
    `  <span class="code-t">Song</span>(string t, string a, string al, string g, int d)`,
    `    : <span class="code-v">title</span>(t), <span class="code-v">artist</span>(a), <span class="code-v">album</span>(al),`,
    `      <span class="code-v">genre</span>(g), <span class="code-v">duration</span>(d), <span class="code-v">next</span>(<span class="code-k">nullptr</span>) {}`,
    `};`,
    ``,
    `<span class="code-c">// ─── LINKED LIST CLASS ────────────────────────</span>`,
    `<span class="code-k">class</span> <span class="code-t">Playlist</span> {`,
    `<span class="code-k">private:</span>`,
    `  <span class="code-t">Song</span>* <span class="code-v">head</span>;`,
    `  int   <span class="code-v">size</span>;`,
    ``,
    `<span class="code-k">public:</span>`,
    `  <span class="code-t">Playlist</span>() : <span class="code-v">head</span>(<span class="code-k">nullptr</span>), <span class="code-v">size</span>(0) {}`,
    ``,
    `  <span class="code-c">// O(1) — Insert at front (new head)</span>`,
    `  <span class="code-k">void</span> <span class="code-n">addFront</span>(string t, string a, string al, string g, int d) {`,
    `    <span class="code-t">Song</span>* newNode = <span class="code-k">new</span> <span class="code-t">Song</span>(t, a, al, g, d); <span class="code-c">// heap alloc</span>`,
    `    newNode-&gt;<span class="code-v">next</span> = <span class="code-v">head</span>;`,
    `    <span class="code-v">head</span> = newNode;`,
    `    <span class="code-v">size</span>++;`,
    `  }`,
    ``,
    `  <span class="code-c">// O(n) — Insert at back (new tail)</span>`,
    `  <span class="code-k">void</span> <span class="code-n">addBack</span>(string t, string a, string al, string g, int d) {`,
    `    <span class="code-t">Song</span>* newNode = <span class="code-k">new</span> <span class="code-t">Song</span>(t, a, al, g, d);`,
    `    <span class="code-k">if</span> (!<span class="code-v">head</span>) { <span class="code-v">head</span> = newNode; <span class="code-v">size</span>++; <span class="code-k">return</span>; }`,
    `    <span class="code-t">Song</span>* curr = <span class="code-v">head</span>;`,
    `    <span class="code-k">while</span> (curr-&gt;<span class="code-v">next</span>) curr = curr-&gt;<span class="code-v">next</span>;`,
    `    curr-&gt;<span class="code-v">next</span> = newNode;`,
    `    <span class="code-v">size</span>++;`,
    `  }`,
    ``,
    `  <span class="code-c">// O(1) — Remove from front</span>`,
    `  <span class="code-k">void</span> <span class="code-n">removeHead</span>() {`,
    `    <span class="code-k">if</span> (!<span class="code-v">head</span>) <span class="code-k">return</span>;`,
    `    <span class="code-t">Song</span>* temp = <span class="code-v">head</span>;`,
    `    <span class="code-v">head</span> = <span class="code-v">head</span>-&gt;<span class="code-v">next</span>;`,
    `    <span class="code-k">delete</span> temp;       <span class="code-c">// free heap memory</span>`,
    `    <span class="code-v">size</span>--;`,
    `  }`,
    ``,
    `  <span class="code-c">// O(n) — Remove from back</span>`,
    `  <span class="code-k">void</span> <span class="code-n">removeTail</span>() {`,
    `    <span class="code-k">if</span> (!<span class="code-v">head</span>) <span class="code-k">return</span>;`,
    `    <span class="code-k">if</span> (!<span class="code-v">head</span>-&gt;<span class="code-v">next</span>) { <span class="code-k">delete</span> <span class="code-v">head</span>; <span class="code-v">head</span> = <span class="code-k">nullptr</span>; <span class="code-v">size</span>--; <span class="code-k">return</span>; }`,
    `    <span class="code-t">Song</span>* curr = <span class="code-v">head</span>;`,
    `    <span class="code-k">while</span> (curr-&gt;<span class="code-v">next</span>-&gt;<span class="code-v">next</span>) curr = curr-&gt;<span class="code-v">next</span>;`,
    `    <span class="code-k">delete</span> curr-&gt;<span class="code-v">next</span>;`,
    `    curr-&gt;<span class="code-v">next</span> = <span class="code-k">nullptr</span>;`,
    `    <span class="code-v">size</span>--;`,
    `  }`,
    ``,
    `  <span class="code-c">// O(n) — Traverse and print all songs</span>`,
    `  <span class="code-k">void</span> <span class="code-n">traverse</span>() <span class="code-k">const</span> {`,
    `    <span class="code-t">Song</span>* curr = <span class="code-v">head</span>;`,
    `    <span class="code-k">while</span> (curr != <span class="code-k">nullptr</span>) {`,
    `      cout &lt;&lt; curr-&gt;<span class="code-v">title</span> &lt;&lt; <span class="code-s">" — "</span> &lt;&lt; curr-&gt;<span class="code-v">artist</span> &lt;&lt; endl;`,
    `      curr = curr-&gt;<span class="code-v">next</span>;`,
    `    }`,
    `  }`,
    ``,
    `  <span class="code-c">// O(n) — Search by title</span>`,
    `  <span class="code-t">Song</span>* <span class="code-n">search</span>(string title) {`,
    `    <span class="code-t">Song</span>* curr = <span class="code-v">head</span>;`,
    `    <span class="code-k">while</span> (curr) {`,
    `      <span class="code-k">if</span> (curr-&gt;<span class="code-v">title</span> == title) <span class="code-k">return</span> curr;`,
    `      curr = curr-&gt;<span class="code-v">next</span>;`,
    `    }`,
    `    <span class="code-k">return</span> <span class="code-k">nullptr</span>; <span class="code-c">// not found</span>`,
    `  }`,
    ``,
    `  int <span class="code-n">getSize</span>() <span class="code-k">const</span> { <span class="code-k">return</span> <span class="code-v">size</span>; }`,
    ``,
    `  <span class="code-c">// Destructor — deallocate all nodes</span>`,
    `  ~<span class="code-t">Playlist</span>() {`,
    `    <span class="code-k">while</span> (<span class="code-v">head</span>) removeHead();`,
    `  }`,
    `};`,
    ``,
    `<span class="code-c">// ─── MAIN ─────────────────────────────────────</span>`,
    `<span class="code-k">int</span> <span class="code-n">main</span>() {`,
    `  <span class="code-t">Playlist</span> myPlaylist;`,
    ``,
    `  myPlaylist.<span class="code-n">addBack</span>(<span class="code-s">"Blinding Lights"</span>, <span class="code-s">"The Weeknd"</span>, <span class="code-s">"After Hours"</span>, <span class="code-s">"pop"</span>, 200);`,
    `  myPlaylist.<span class="code-n">addBack</span>(<span class="code-s">"HUMBLE."</span>, <span class="code-s">"Kendrick Lamar"</span>, <span class="code-s">"DAMN."</span>, <span class="code-s">"hip-hop"</span>, 177);`,
    `  myPlaylist.<span class="code-n">addBack</span>(<span class="code-s">"Bohemian Rhapsody"</span>, <span class="code-s">"Queen"</span>, <span class="code-s">"A Night at the Opera"</span>, <span class="code-s">"rock"</span>, 355);`,
    `  myPlaylist.<span class="code-n">addFront</span>(<span class="code-s">"Levitating"</span>, <span class="code-s">"Dua Lipa"</span>, <span class="code-s">"Future Nostalgia"</span>, <span class="code-s">"pop"</span>, 204);`,
    ``,
    `  cout &lt;&lt; <span class="code-s">"=== My Playlist ==="</span> &lt;&lt; endl;`,
    `  myPlaylist.<span class="code-n">traverse</span>();`,
    `  cout &lt;&lt; <span class="code-s">"Total songs: "</span> &lt;&lt; myPlaylist.<span class="code-n">getSize</span>() &lt;&lt; endl;`,
    ``,
    `  myPlaylist.<span class="code-n">removeHead</span>(); <span class="code-c">// remove first song</span>`,
    `  myPlaylist.<span class="code-n">removeTail</span>(); <span class="code-c">// remove last song</span>`,
    ``,
    `  <span class="code-k">return</span> 0; <span class="code-c">// destructor frees all memory</span>`,
    `}`,
  ].join('\n');
}

// ════════════════════════════════════════════
//  ALBUMS
// ════════════════════════════════════════════

function renderAlbums() {
  const grid = document.getElementById('albums-grid');
  if (!grid) return;
  grid.innerHTML = '';

  ALBUMS.forEach(alb => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-art" style="background:linear-gradient(135deg,${alb.color},#0a0a15)">
        <span>${alb.emoji}</span>
        <div class="card-play">
          <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
      <div class="card-name">${alb.name}</div>
      <div class="card-sub">${alb.artist}</div>
    `;
    card.querySelector('.card-play').addEventListener('click', e => {
      e.stopPropagation();
      const song = SONGS.find(s => s.id === alb.songs[0]);
      if (song) playSong(song);
    });
    card.addEventListener('dblclick', () => {
      const song = SONGS.find(s => s.id === alb.songs[0]);
      if (song) playSong(song);
    });
    grid.appendChild(card);
  });
}

// ════════════════════════════════════════════
//  TRACK LIST
// ════════════════════════════════════════════

function getFilteredSongs() {
  let songs = [...SONGS];
  if (currentGenre !== 'all') songs = songs.filter(s => s.genre === currentGenre);
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    songs = songs.filter(s =>
      s.title.toLowerCase().includes(q)  ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q)
    );
  }
  return songs;
}

function renderTracks(songs, containerId = 'track-list') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (songs.length === 0) {
    container.innerHTML = '<div style="padding:28px;text-align:center;color:var(--text-dim)">No tracks found</div>';
    return;
  }

  songs.forEach((song, i) => {
    const playing = currentTrack && currentTrack.id === song.id;
    const liked   = likedSongs.has(song.id);

    const row = document.createElement('div');
    row.className = 'track' + (playing ? ' playing' : '');
    row.id        = 'track-' + song.id;

    row.innerHTML = `
      <div class="track-num">
        ${playing && isPlaying
          ? `<div class="playing-anim">
               <div class="playing-bar"></div>
               <div class="playing-bar"></div>
               <div class="playing-bar"></div>
             </div>`
          : i + 1}
      </div>
      <div class="track-info">
        <div class="track-thumb"
             style="background:linear-gradient(135deg,${song.color || '#1a1a3e'},#0a0a15)">
          ${song.emoji}
        </div>
        <div>
          <div class="track-title">${song.title}</div>
          <div class="track-artist">${song.artist}</div>
        </div>
      </div>
      <div class="track-album">${song.album}</div>
      <div class="track-like ${liked ? 'liked' : ''}">
        <svg viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
      <div class="track-dur">${song.dur}</div>
    `;

    row.addEventListener('dblclick', () => playSong(song));
    row.querySelector('.track-like').addEventListener('click', e => {
      e.stopPropagation();
      toggleLike(song.id);
    });

    container.appendChild(row);
  });

  const countEl = document.getElementById('track-count');
  if (countEl) countEl.textContent = songs.length + ' tracks';
}

function filterGenre(genre, btn) {
  currentGenre = genre;
  document.querySelectorAll('.btn-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTracks(getFilteredSongs());
}

function liveSearch(val) {
  currentSearch = val.trim();
  renderTracks(getFilteredSongs());
}

function liveSearch2(val) {
  const q = val.trim().toLowerCase();
  const results = SONGS.filter(s =>
    s.title.toLowerCase().includes(q)  ||
    s.artist.toLowerCase().includes(q) ||
    s.album.toLowerCase().includes(q)
  );
  renderTracks(results, 'search-results');
}

// ════════════════════════════════════════════
//  PLAYER
// ════════════════════════════════════════════

function playSong(song) {
  currentTrack = song;
  isPlaying    = true;

  // Update player bar
  document.getElementById('player-name').textContent   = song.title;
  document.getElementById('player-artist').textContent = song.artist;
  const thumb = document.getElementById('player-thumb');
  thumb.textContent   = song.emoji;
  thumb.style.background = `linear-gradient(135deg,${song.color || '#1a1a3e'},#0a0a15)`;
  document.getElementById('total-time').textContent = song.dur;
  document.getElementById('player-like').className  =
    'player-like' + (likedSongs.has(song.id) ? ' liked' : '');

  // Switch play icon to pause
  document.getElementById('play-icon').setAttribute('points', '6 19 6 5 19 12');

  startProgress();
  updateHero(song);
  renderTracks(getFilteredSongs());
}

function updateHero(song) {
  document.getElementById('hero-title').textContent = song.title;
  document.getElementById('hero-desc').textContent  =
    `Now playing "${song.title}" by ${song.artist} — from the album "${song.album}".`
    + ` Each song is dynamically allocated as a node in the C++ linked list queue.`;
}

function playAll() {
  playSong(SONGS[0]);
}

function togglePlay() {
  if (!currentTrack) { playSong(SONGS[0]); return; }
  isPlaying = !isPlaying;
  const icon = document.getElementById('play-icon');
  if (isPlaying) {
    icon.setAttribute('points', '6 19 6 5 19 12');
    startProgress();
  } else {
    icon.setAttribute('points', '5 3 19 12 5 21 5 3');
    clearInterval(progressTimer);
  }
  renderTracks(getFilteredSongs());
}

function startProgress() {
  clearInterval(progressTimer);
  const dur = parseDuration(currentTrack ? currentTrack.dur : '3:30');
  progress  = 0;
  progressTimer = setInterval(() => {
    progress++;
    if (progress >= dur) {
      progress = 0;
      if (!isRepeat) { nextTrack(); return; }
    }
    const pct = (progress / dur) * 100;
    document.getElementById('prog-fill').style.width = pct + '%';
    document.getElementById('cur-time').textContent  = formatTime(progress);
  }, 1000);
}

function seekTo(e) {
  const bar = document.getElementById('prog-bar');
  const pct = Math.max(0, Math.min(1, e.offsetX / bar.offsetWidth));
  const dur = parseDuration(currentTrack ? currentTrack.dur : '3:30');
  progress  = Math.floor(pct * dur);
  document.getElementById('prog-fill').style.width = (pct * 100) + '%';
  document.getElementById('cur-time').textContent  = formatTime(progress);
}

function nextTrack() {
  const songs = getFilteredSongs();
  if (!songs.length) return;
  let idx = songs.findIndex(s => currentTrack && s.id === currentTrack.id);
  if (isShuffle) idx = Math.floor(Math.random() * songs.length);
  else           idx = (idx + 1) % songs.length;
  playSong(songs[idx]);
}

function prevTrack() {
  const songs = getFilteredSongs();
  if (!songs.length) return;
  let idx = songs.findIndex(s => currentTrack && s.id === currentTrack.id);
  idx = (idx - 1 + songs.length) % songs.length;
  playSong(songs[idx]);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  document.getElementById('btn-shuffle').classList.toggle('active', isShuffle);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  document.getElementById('btn-repeat').classList.toggle('active', isRepeat);
}

// ════════════════════════════════════════════
//  LIKES
// ════════════════════════════════════════════

function toggleLike(id) {
  if (likedSongs.has(id)) {
    likedSongs.delete(id);
    showNotif('Removed from Liked Songs');
  } else {
    likedSongs.add(id);
    showNotif('Added to Liked Songs ❤️');
  }
  renderTracks(getFilteredSongs());
  renderLiked();
  renderStats();

  if (currentTrack && currentTrack.id === id) {
    document.getElementById('player-like').className =
      'player-like' + (likedSongs.has(id) ? ' liked' : '');
  }
}

function togglePlayerLike() {
  if (currentTrack) toggleLike(currentTrack.id);
}

// ════════════════════════════════════════════
//  LIBRARY PAGE
// ════════════════════════════════════════════

function renderLiked() {
  const liked = SONGS.filter(s => likedSongs.has(s.id));
  renderTracks(liked, 'liked-list');
}

function renderStats() {
  const row = document.getElementById('stats-row');
  if (!row) return;

  const likedCount  = likedSongs.size;
  const genreSet    = new Set(SONGS.filter(s => likedSongs.has(s.id)).map(s => s.genre));

  row.innerHTML = `
    <div class="stat-chip">
      <div class="stat-chip-val">${SONGS.length}</div>
      <div class="stat-chip-label">Total Songs</div>
    </div>
    <div class="stat-chip">
      <div class="stat-chip-val">${likedCount}</div>
      <div class="stat-chip-label">Liked Songs</div>
    </div>
    <div class="stat-chip">
      <div class="stat-chip-val">${ALBUMS.length}</div>
      <div class="stat-chip-label">Albums</div>
    </div>
    <div class="stat-chip">
      <div class="stat-chip-val">${genreSet.size || 4}</div>
      <div class="stat-chip-label">Genres</div>
    </div>
  `;

  // Genre bars
  const genreData = { pop:0, 'hip-hop':0, rock:0, electronic:0 };
  SONGS.forEach(s => { if (genreData[s.genre] !== undefined) genreData[s.genre]++; });
  const max = Math.max(...Object.values(genreData));

  const gb = document.getElementById('genre-bars');
  if (gb) {
    gb.innerHTML = Object.entries(genreData).map(([g, c]) => `
      <div class="genre-bar">
        <div class="genre-bar-top">
          <span style="text-transform:capitalize">${g}</span>
          <span style="color:var(--text-muted)">${c} tracks</span>
        </div>
        <div class="genre-bar-track">
          <div class="genre-bar-fill" style="width:${(c / max) * 100}%"></div>
        </div>
      </div>
    `).join('');
  }
}

// ════════════════════════════════════════════
//  SIDEBAR PLAYLISTS
// ════════════════════════════════════════════

function renderSidebarPlaylists() {
  const el = document.getElementById('sidebar-playlists');
  if (!el) return;
  el.innerHTML = ALBUMS.map((alb, i) => `
    <div class="playlist-item ${i === 0 ? 'active' : ''}"
         onclick="selectPlaylist(this, ${alb.songs[0]})">
      <div class="playlist-dot"></div>
      <span>${alb.name}</span>
    </div>
  `).join('');
}

function selectPlaylist(el, firstSongId) {
  document.querySelectorAll('.playlist-item').forEach(x => x.classList.remove('active'));
  el.classList.add('active');
  const song = SONGS.find(s => s.id === firstSongId);
  if (song) playSong(song);
}

// ════════════════════════════════════════════
//  PAGE NAVIGATION
// ════════════════════════════════════════════

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  const navMap = { home:0, search:1, library:2, cpp:3 };

  if (pageEl) pageEl.classList.add('active');
  const navItems = document.querySelectorAll('.nav-item');
  if (navItems[navMap[page]]) navItems[navMap[page]].classList.add('active');

  // Page-specific init
  if (page === 'library') { renderLiked(); renderStats(); }
  if (page === 'cpp')     { renderLL();    renderMemDiag(); }
}

// ════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════

function parseDuration(str) {
  const parts = str.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function showNotif(msg) {
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

// ════════════════════════════════════════════
//  INIT — runs on page load
// ════════════════════════════════════════════

(function init() {
  initLL();
  renderAlbums();
  renderTracks(SONGS);
  renderSidebarPlaylists();
  renderCppCode();
  renderStats();
})();
