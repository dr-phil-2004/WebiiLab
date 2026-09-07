# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

---

## Bug Fixes — Live Webinar Black Screen (2026-08-07)

La page `/live-webinar/[id]` affichait un écran noir à cause de plusieurs bugs liés à l'intégration Stream. Voici les corrections apportées :

### Bug 1 : `userToken does not have a user_id or is not matching with user.id`

**Cause racine :** Le token JWT stocké dans `.env` (`STREAM_TOKEN`) contenait un `user_id: "demo-user-I6MbsNYB"`, mais le code passait `userId = "1705600"` (depuis `NEXT_PUBLIC_STREAM_USER_ID`) à `connectUser()`. Le SDK Stream exige que le `user_id` dans le JWT corresponde exactement à l'`id` passé à `connectUser()`.

**Correction :**
- **Nouveau fichier `app/actions/stream.ts`** — Action serveur qui génère un token dynamiquement via `@stream-io/node-sdk` pour chaque utilisateur authentifié. Le `user_id` dans le token correspond toujours au `userId` réel.
- **`page.tsx`** — Remplacé `process.env.STREAM_TOKEN` (token statique) par un appel à `generateStreamToken(userId)`.
- **`CustomLiveStreamPlayer.tsx`** — Remplacé `process.env.NEXT_PUBLIC_STREAM_USER_ID!` par un prop `userId` passé depuis le parent.
- **`LiveStreamState.tsx`** — Accepte et transmet `userId` comme prop au lieu de fallback sur une variable d'environnement.
- **`RenderWebinar.tsx`** — Accepte et transmet `userId` dans la chaîne de composants.

### Bug 2 : `apiKey` était `undefined`

**Cause racine :** `page.tsx` utilisait `process.env.STREAM_API_KEY` qui n'existait pas dans `.env`. La variable correcte est `NEXT_PUBLIC_STREAM_API_KEY`.

**Correction :** Changé en `process.env.NEXT_PUBLIC_STREAM_API_KEY` dans `page.tsx`.

### Bug 3 : Boucle infinie dans `useEffect` (LiveWebinarView)

**Cause racine :** `chatClient` était dans le tableau de dépendances du `useEffect` qui le définissait via `setChatClient(client)`. Cela créait un cycle : l'effet se déclenchait → définissait `chatClient` → le changement de `chatClient` redéclenchait l'effet → boucle infinie.

**Correction :**
- Supprimé `chatClient` du tableau de dépendances.
- Ajouté un `useRef` (`chatClientRef`) pour gérer le cleanup de `disconnectUser()` sans dépendre du state.
- Ajouté un flag `isCancelled` pour éviter les mises à jour de state après le démontage du composant.

### Bug 4 : Condition inversée dans `handleCTAButtonClick`

**Cause racine :** Le code avait `if (!channel)` ce qui tentait d'envoyer un événement quand `channel` était `null` (impossible).

**Correction :** Changé en `if (channel)`.

### Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `app/actions/stream.ts` | **[NOUVEAU]** Action serveur pour générer des tokens Stream dynamiques |
| `app/(publicRoutes)/live-webinar/[liveWebinarId]/page.tsx` | Token dynamique, API key corrigée, `userId` ajouté |
| `app/(publicRoutes)/live-webinar/[liveWebinarId]/_components/RenderWebinar.tsx` | Prop `userId` ajoutée et transmise |
| `app/(publicRoutes)/live-webinar/[liveWebinarId]/_components/LiveWebinar/LiveStreamState.tsx` | Prop `userId` utilisée au lieu de l'env var |
| `app/(publicRoutes)/live-webinar/[liveWebinarId]/_components/LiveWebinar/CustomLiveStreamPlayer.tsx` | Prop `userId` au lieu de `NEXT_PUBLIC_STREAM_USER_ID` |
| `app/(publicRoutes)/live-webinar/[liveWebinarId]/_components/Common/LiveWebinarView.tsx` | useEffect loop fix, cleanup ref, CTA logic fix |
