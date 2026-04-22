# Melodix — Music Player (College Project)
## Dynamic Memory Allocation using Linked List in C++

---

## 📁 Project Structure

```
melodix/
├── index.html        ← Main webpage (Spotify-like UI)
├── style.css         ← All styling
├── app.js            ← JavaScript (linked list + player logic)
├── playlist.cpp      ← C++ source (compile & run separately)
└── README.md         ← This file
```

---

## 🚀 How to Run

### Web Application
1. Open `index.html` in any browser (Chrome, Firefox, Edge)
2. No server or installation needed — it's pure HTML/CSS/JS

### C++ Program
```bash
g++ -o melodix playlist.cpp
./melodix
```

---

## 🎯 Project Concept

This project demonstrates **Dynamic Memory Allocation** using a **Singly Linked List** implemented in C++. A music player (Melodix) is the real-world context.

### What is a Linked List?
A linked list is a linear data structure where each element (called a **node**) contains:
- **Data** — the actual value (here: a Song)
- **Pointer** — address of the next node in memory

### Dynamic Memory Allocation
Unlike arrays (which use the stack), a linked list allocates memory **at runtime** on the **heap** using the `new` operator in C++:

```cpp
Song* newNode = new Song(title, artist, album, genre, duration);
```

When a node is no longer needed, its memory is freed using `delete`:

```cpp
delete temp;   // returns memory to the heap
```

---

## 📐 Data Structure — Song Node

```cpp
struct Song {
    string title;
    string artist;
    string album;
    string genre;
    int    duration;
    Song*  next;      // pointer to next node
};
```

Each `Song` object is stored as a node. The `next` pointer forms the chain.

---

## ⚙️ Operations & Time Complexity

| Operation       | Method        | Complexity | Description                        |
|----------------|---------------|------------|------------------------------------|
| Insert at front | `addFront()`  | O(1)       | New node becomes the new head      |
| Insert at back  | `addBack()`   | O(n)       | Traverse to tail, then append      |
| Remove head     | `removeHead()`| O(1)       | Free head, update head pointer     |
| Remove tail     | `removeTail()`| O(n)       | Traverse to second-to-last node    |
| Traverse        | `traverse()`  | O(n)       | Visit every node                   |
| Search          | `search()`    | O(n)       | Find a node by song title          |
| Reverse         | `reverse()`   | O(n)       | Flip all next pointers             |

---

## 🌐 Website Features

- **Home** — Hero section, album cards, full track list with genre filter & search
- **Search** — Live real-time search
- **Library** — Liked songs, stats, genre breakdown
- **C++ Memory View** — Live linked list node diagram, interactive operations, C++ code, heap memory layout

---

## 🔑 Key C++ Concepts Demonstrated

1. **`new` operator** — Heap allocation at runtime
2. **`delete` operator** — Freeing heap memory to prevent leaks
3. **Pointers (`Song*`)** — Storing addresses of dynamically allocated objects
4. **Destructor (`~Playlist()`)** — Automatic cleanup when object goes out of scope
5. **Struct** — Grouping data fields into a single unit
6. **Class with private/public** — Encapsulation of the linked list

---

## 📝 Sample Output (C++ program)

```
[addBack] Allocated node at 0x55a1b2c3d4e5 — Title: Blinding Lights
[addBack] Allocated node at 0x55a1b2c3d5f6 — Title: HUMBLE.
[addFront] Allocated node at 0x55a1b2c3d7g8 — Title: Levitating

=== Playlist (5 songs) ===
1. Levitating — Dua Lipa [3:24]  (addr: 0x...d7g8)
2. Blinding Lights — The Weeknd [3:20]  (addr: 0x...d4e5)
3. HUMBLE. — Kendrick Lamar [2:57]  (addr: 0x...d5f6)
...

[removeHead] Freed memory at 0x...d7g8 — Title: Levitating
[Destructor] Freeing all nodes...
[Destructor] All memory freed.
```

---

*Melodix — College Project | Dynamic Memory Allocation using Linked List*
