// ============================================
//  Melodix — C++ Linked List Implementation
//  Topic   : Dynamic Memory Allocation
//  Subject : Data Structures
//  Submitted by : [Your Name / Roll No]
// ============================================

#include <iostream>
#include <string>
using namespace std;

// ─────────────────────────────────────────────
//  SONG NODE STRUCTURE
//  Each song is one node allocated on the HEAP.
//  Memory is reserved using the `new` operator.
// ─────────────────────────────────────────────
struct Song {
    string title;
    string artist;
    string album;
    string genre;
    int    duration;   // duration in seconds
    Song*  next;       // pointer to the next node

    // Parameterised constructor
    Song(string t, string a, string al, string g, int d)
        : title(t), artist(a), album(al), genre(g), duration(d), next(nullptr) {}
};

// ─────────────────────────────────────────────
//  PLAYLIST CLASS — Singly Linked List
// ─────────────────────────────────────────────
class Playlist {
private:
    Song* head;   // pointer to the first node
    int   size;   // total number of songs

public:
    // Constructor — empty list
    Playlist() : head(nullptr), size(0) {}

    // ── INSERT AT FRONT  O(1) ──────────────────
    // Allocates a new node on the heap and makes
    // it the new head of the list.
    void addFront(string t, string a, string al, string g, int d) {
        Song* newNode   = new Song(t, a, al, g, d); // heap allocation
        newNode->next   = head;
        head            = newNode;
        size++;
        cout << "[addFront] Allocated node at " << newNode
             << " — Title: " << newNode->title << endl;
    }

    // ── INSERT AT BACK  O(n) ───────────────────
    // Traverses to the tail and appends a new node.
    void addBack(string t, string a, string al, string g, int d) {
        Song* newNode = new Song(t, a, al, g, d);
        if (!head) {
            head = newNode;
            size++;
            cout << "[addBack] Allocated first node at " << newNode << endl;
            return;
        }
        Song* curr = head;
        while (curr->next) curr = curr->next;  // traverse to tail
        curr->next = newNode;
        size++;
        cout << "[addBack] Allocated node at " << newNode
             << " — Title: " << newNode->title << endl;
    }

    // ── REMOVE HEAD  O(1) ─────────────────────
    // Frees the first node and updates head.
    void removeHead() {
        if (!head) { cout << "[removeHead] List is empty.\n"; return; }
        Song* temp = head;
        head       = head->next;
        cout << "[removeHead] Freed memory at " << temp
             << " — Title: " << temp->title << endl;
        delete temp;   // deallocate heap memory
        size--;
    }

    // ── REMOVE TAIL  O(n) ─────────────────────
    // Traverses to the second-to-last node and
    // frees the last node.
    void removeTail() {
        if (!head) { cout << "[removeTail] List is empty.\n"; return; }
        if (!head->next) {
            cout << "[removeTail] Freed memory at " << head
                 << " — Title: " << head->title << endl;
            delete head;
            head = nullptr;
            size--;
            return;
        }
        Song* curr = head;
        while (curr->next->next) curr = curr->next;
        cout << "[removeTail] Freed memory at " << curr->next
             << " — Title: " << curr->next->title << endl;
        delete curr->next;
        curr->next = nullptr;
        size--;
    }

    // ── TRAVERSE  O(n) ────────────────────────
    // Visits every node and prints its data.
    void traverse() const {
        if (!head) { cout << "(empty playlist)\n"; return; }
        Song* curr = head;
        int   idx  = 1;
        cout << "\n=== Playlist (" << size << " songs) ===" << endl;
        while (curr != nullptr) {
            cout << idx++ << ". " << curr->title
                 << " — " << curr->artist
                 << " [" << curr->duration / 60
                 << ":" << (curr->duration % 60 < 10 ? "0" : "")
                 << curr->duration % 60 << "]"
                 << "  (addr: " << curr << ")"
                 << endl;
            curr = curr->next;
        }
        cout << "==========================\n" << endl;
    }

    // ── SEARCH  O(n) ──────────────────────────
    // Returns a pointer to the matching node or nullptr.
    Song* search(const string& title) const {
        Song* curr = head;
        while (curr) {
            if (curr->title == title) return curr;
            curr = curr->next;
        }
        return nullptr;
    }

    // ── REVERSE  O(n) ─────────────────────────
    // Reverses the direction of all next pointers.
    void reverse() {
        Song* prev    = nullptr;
        Song* current = head;
        Song* next    = nullptr;
        while (current) {
            next           = current->next;
            current->next  = prev;
            prev           = current;
            current        = next;
        }
        head = prev;
        cout << "[reverse] Playlist reversed." << endl;
    }

    int getSize() const { return size; }

    // ── DESTRUCTOR ────────────────────────────
    // Automatically called when Playlist goes out
    // of scope — ensures no memory leaks.
    ~Playlist() {
        cout << "\n[Destructor] Freeing all nodes..." << endl;
        while (head) removeHead();
        cout << "[Destructor] All memory freed." << endl;
    }
};

// ─────────────────────────────────────────────
//  MAIN — Demo of dynamic memory allocation
// ─────────────────────────────────────────────
int main() {
    cout << "============================================" << endl;
    cout << "  Melodix — Dynamic Memory / Linked List   " << endl;
    cout << "============================================\n" << endl;

    Playlist myPlaylist;

    // Add songs using dynamic allocation (new)
    myPlaylist.addBack("Blinding Lights",    "The Weeknd",     "After Hours",          "pop",        200);
    myPlaylist.addBack("HUMBLE.",            "Kendrick Lamar", "DAMN.",                "hip-hop",    177);
    myPlaylist.addBack("Bohemian Rhapsody",  "Queen",          "A Night at the Opera", "rock",       355);
    myPlaylist.addBack("One More Time",      "Daft Punk",      "Discovery",            "electronic", 320);
    myPlaylist.addFront("Levitating",        "Dua Lipa",       "Future Nostalgia",     "pop",        204);

    // Display all songs
    myPlaylist.traverse();

    // Search for a song
    Song* found = myPlaylist.search("HUMBLE.");
    if (found) cout << "Found: " << found->title << " at address " << found << endl;

    // Remove songs and check memory
    myPlaylist.removeHead();
    myPlaylist.removeTail();
    myPlaylist.traverse();

    // Reverse the playlist
    myPlaylist.reverse();
    myPlaylist.traverse();

    cout << "Playlist size: " << myPlaylist.getSize() << " songs" << endl;

    return 0;
    // ~Playlist() is called here — all heap memory freed
}

// ─────────────────────────────────────────────
//  EXPECTED OUTPUT (trimmed):
//
//  [addBack] Allocated node at 0x... — Title: Blinding Lights
//  [addBack] Allocated node at 0x... — Title: HUMBLE.
//  ... (more allocations)
//  [addFront] Allocated node at 0x... — Title: Levitating
//
//  === Playlist (5 songs) ===
//  1. Levitating — Dua Lipa [3:24]  (addr: 0x...)
//  2. Blinding Lights — The Weeknd [3:20] ...
//  ...
//
//  [removeHead] Freed memory at 0x... — Title: Levitating
//  [removeTail] Freed memory at 0x... — Title: One More Time
//  [Destructor] Freeing all nodes...
// ─────────────────────────────────────────────
