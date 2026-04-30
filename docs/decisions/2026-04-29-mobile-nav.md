# B5: Mobil hamburger-meny + swipe-gester

**Datum:** 2026-04-29
**Status:** Implementerad

## Vad jag byggde

### 1. MobileNav-komponent (`src/components/mobile-nav.tsx`)

- Hamburger-meny för mobil (<640px)
- Animerad drawer från höger med Framer Motion
- Spring-animerad för naturlig känsla
- Swipe-to-close: dra höger för att stänga
- Escape-tangent stänger menyn
- Body scroll låses när meny är öppen
- Automatisk stängning vid navigation

### 2. Swipe-verktyg

- `useSwipeGesture` hook för touch-events
- Detekterar swipe-riktning (vänster/höger/upp/ner)
- Konfigurerbar threshold
- `SwipeableContainer` komponent för Framer Motion drag

### 3. Uppdaterad Header

- Konverterad till client component
- Active state på navigeringslänkar
- Desktop + mobil navigation i samma komponent
- NAV_ITEMS array för konsekvent navigation

## Designval

1. **Drawer från höger** — Naturligt för högerhand, vanligast på mobil
2. **Spring animation** — `damping: 30, stiffness: 300` ger snabb men mjuk känsla
3. **Backdrop blur** — Semi-transparent overlay med blur för djup
4. **Swipe hint** — Text som berättar att man kan svepa för att stänga
5. **Sekventiella animationer** — Menyobjekt animeras in med delay för cascade-effekt
6. **Body scroll lock** — Förhindrar bakgrundsscrollning när meny är öppen

## Filer som ändrats/skapats

| Fil | Typ |
|-----|-----|
| `src/components/mobile-nav.tsx` | Ny |
| `src/components/header.tsx` | Uppdaterad (client component) |

## API

### MobileNav

```tsx
<MobileNav className="optional-class" />
```

### useSwipeGesture

```tsx
const ref = useRef<HTMLDivElement>(null);
useSwipeGesture(ref, {
  onSwipeLeft: () => console.log('swiped left'),
  onSwipeRight: () => console.log('swiped right'),
}, 50); // threshold i pixlar
```

### SwipeableContainer

```tsx
<SwipeableContainer
  onSwipeLeft={() => goToNextPoster()}
  onSwipeRight={() => goToPrevPoster()}
>
  {children}
</SwipeableContainer>
```

## Vad nästa person bör veta

1. **Poster-navigation**: Använd `SwipeableContainer` eller `useSwipeGesture` i `/affischer/[id]` för att navigera mellan affischer med swipe

2. **Touch-optimering**: Knapparna i mobilmenyn är 48px höga för bra touch-target

3. **Tillgänglighet**:
   - `aria-expanded` på hamburger-knapp
   - `aria-label` på alla knappar
   - Escape-tangent stänger menyn

4. **Utbyggnad**:
   - Lägg till sökfält i mobilmenyn
   - Submeny för "Analysverktyg" (ord-explorer, tonlägen)

## Verifierat

- [x] TypeScript kompilerar utan fel
- [x] Build lyckas
- [x] Hamburger-meny öppnar drawer
- [x] Swipe stänger drawer
- [x] Escape stänger drawer
- [x] Navigation stänger drawer
- [x] Active state på länkar fungerar
- [x] Body scroll låses
