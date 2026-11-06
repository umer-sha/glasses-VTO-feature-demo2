"use client";

import { useSyncExternalStore } from "react";
import { getGlasses } from "@/lib/glasses";

export interface CartItem {
  id: string; // product id in glasses.ts
  color: string; // colour name
  qty: number;
}
interface CartState {
  items: CartItem[];
  lastAdded: { id: string; color: string; t: number } | null; // not saved, only used for the toast
}

const KEY = "lumiere2-cart-v1";
const EMPTY: CartState = { items: [], lastAdded: null };
let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const items = JSON.parse(raw) as CartItem[];
      if (Array.isArray(items)) state = { items: items.filter((i) => i && i.id && i.qty > 0), lastAdded: null };
    }
  } catch {
    /* storage blocked: the cart still works for this visit */
  }
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      try {
        state = { items: JSON.parse(e.newValue || "[]"), lastAdded: null };
      } catch {
        state = EMPTY;
      }
      emit();
    }
  });
}
function emit() {
  listeners.forEach((l) => l());
}
function commit(items: CartItem[], lastAdded: CartState["lastAdded"] = null) {
  state = { items, lastAdded };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
  emit();
}
function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const getSnapshot = () => {
  load();
  return state;
};
const getServerSnapshot = () => EMPTY;

// ----- actions (same cart everywhere: header, product page, try-on, voice, checkout) -----
export const cart = {
  add(id: string, color: string, qty = 1) {
    load();
    const items = state.items.map((i) => ({ ...i }));
    const found = items.find((i) => i.id === id && i.color === color);
    if (found) found.qty = Math.min(10, found.qty + qty);
    else items.push({ id, color, qty });
    commit(items, { id, color, t: Date.now() });
  },
  setQty(id: string, color: string, qty: number) {
    load();
    const items = state.items
      .map((i) => (i.id === id && i.color === color ? { ...i, qty: Math.max(0, Math.min(10, qty)) } : i))
      .filter((i) => i.qty > 0);
    commit(items);
  },
  remove(id: string, color: string) {
    load();
    commit(state.items.filter((i) => !(i.id === id && i.color === color)));
  },
  removeProduct(id: string) {
    load();
    commit(state.items.filter((i) => i.id !== id));
  },
  size() {
    load();
    return state.items.reduce((n, i) => n + i.qty, 0);
  },
  clear() {
    load();
    commit([]);
  },
};

export function useCart() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const lines = s.items.map((i) => ({ ...i, product: getGlasses(i.id) }));
  const count = s.items.reduce((n, i) => n + i.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  return { items: s.items, lines, count, subtotal, lastAdded: s.lastAdded };
}

export const money = (n: number) => `$${n.toFixed(2)}`;
