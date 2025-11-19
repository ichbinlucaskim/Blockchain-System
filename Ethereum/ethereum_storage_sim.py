# ethereum_storage_sim.py
# Simulating the Ethereum Storage Model (Simplified Merkle Trie)
# Author: Lucas Kim

import hashlib
import json

class SimpleMerkleTrie:
    def __init__(self):
        self.store = {}

    def put(self, key, value):
        self.store[key] = value

    def get(self, key):
        return self.store.get(key, None)

    def compute_root(self):
        # Sort keys for deterministic hashing
        items = sorted(self.store.items())
        serialized = json.dumps(items).encode()
        return hashlib.sha256(serialized).hexdigest()

# --- Demo ---
if __name__ == "__main__":
    trie = SimpleMerkleTrie()
    trie.put("0xA", 100)
    trie.put("0xB", 200)
    trie.put("0xC", 300)

    print("Key-Value Store:", trie.store)
    print("Merkle Root Hash:", trie.compute_root())

    trie.put("0xB", 250)
    print("\nAfter updating key 0xB:")
    print("Key-Value Store:", trie.store)
    print("New Merkle Root Hash:", trie.compute_root())