
# Plan: Hantering av undermappar och kompakt dokumentvisning

## Sammanfattning

Implementerar admin-funktionalitet för att skapa, byta namn på och ta bort undermappar ("mappar") direkt från gränssnittet. Dessutom förbättras dokumentvisningen med en kompakt listvy för att minska scrollande.

---

## Funktioner som läggs till

### 1. Skapa ny undermapp
- Admin ser en "+ Ny mapp"-knapp vid underkategorier
- Öppnar en dialog där man anger namn och beskrivning
- Slug genereras automatiskt från namn

### 2. Redigera mappnamn
- Admin kan klicka på en redigera-knapp för varje undermapp
- Inline-redigering av namn och beskrivning

### 3. Ta bort mapp
- Admin kan ta bort tomma undermappar (endast om det inte finns dokument)
- Bekräftelsedialog innan borttagning

### 4. Kompakt dokumentvy
- Toggle mellan "Kort" och "Kompakt" vy
- Kompakt vy: en rad per dokument (ikon, titel, typ, datum, åtgärdsknappar)
- Användarens preferens sparas i localStorage

### 5. Flytta dokument mellan mappar
- Admin kan välja vilken mapp ett dokument ska tillhöra vid uppladdning
- Möjlighet att flytta befintliga dokument

---

## Visuell förändring

```text
+----------------------------------------------------------+
|  Arbetsmiljö                                             |
|----------------------------------------------------------|
|  Undermappar:                            [+ Ny mapp]     |
|  +--------------------------------------------------+    |
|  | Rutiner       | Beskrivning... | [✏️] [🗑️]       |    |
|  | Blanketter    | Beskrivning... | [✏️] [🗑️]       |    |
|  | Heta arbeten  | Beskrivning... | [✏️] [🗑️]       |    |
|  | Skyddsronder  | Beskrivning... | [✏️] [🗑️]       |    |
|  +--------------------------------------------------+    |
|----------------------------------------------------------|
|  Dokument                      [Kompakt vy] [Kort-vy]    |
|----------------------------------------------------------|
|  Kompakt vy:                                             |
|  +--------------------------------------------------+    |
|  | Ikon | Titel           | Typ  | Datum  | Åtgärd  |    |
|  +--------------------------------------------------+    |
|  | 📄   | Policy.pdf      | PDF  | 2 dgr  | ⬇️ 👁️    |    |
|  | 📄   | Rutin-1.pdf     | PDF  | 1 v    | ⬇️ 👁️    |    |
|  | 📊   | Budget.xlsx     | Excel| 3 dgr  | ⬇️       |    |
|  +--------------------------------------------------+    |
+----------------------------------------------------------+
```

---

## Ändringar

### Nya komponenter

| Fil | Beskrivning |
|-----|-------------|
| `src/components/SubcategoryManager.tsx` | Admin-sektion för att hantera undermappar (skapa/redigera/ta bort) |
| `src/components/CreateSubcategoryDialog.tsx` | Dialog för att skapa ny undermapp |
| `src/components/DocumentCompactView.tsx` | Kompakt tabellvy för dokument |
| `src/components/ViewModeToggle.tsx` | Toggle-knappar för att växla vy |

### Uppdaterade filer

| Fil | Ändringar |
|-----|-----------|
| `src/hooks/useCategories.ts` | Lägger till mutations för skapa, uppdatera och ta bort kategorier |
| `src/pages/CategoryPage.tsx` | Integrerar nya komponenter, vy-toggle, och underkategori-hantering |

---

## Tekniska detaljer

### useCategories.ts - nya hooks

```typescript
// Skapa undermapp
export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, description, parentId }: CreateCategoryParams) => {
      const slug = generateSlug(name, parentId);
      const { data, error } = await supabase
        .from("categories")
        .insert({ name, description, parent_id: parentId, slug })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// Uppdatera undermapp
export function useUpdateCategory() { ... }

// Ta bort undermapp
export function useDeleteCategory() { ... }
```

### SubcategoryManager.tsx

```tsx
// Admin-sektion som visas ovanför underkategorier
{isAdmin && (
  <SubcategoryManager 
    subcategories={subcategories} 
    parentCategoryId={category.id}
    parentSlug={category.slug}
  />
)}
```

### ViewModeToggle och localStorage

```tsx
const [viewMode, setViewMode] = useState<"compact" | "cards">(() => {
  return localStorage.getItem("doc-view-mode") as "compact" | "cards" || "cards";
});

useEffect(() => {
  localStorage.setItem("doc-view-mode", viewMode);
}, [viewMode]);
```

### DocumentCompactView.tsx

```tsx
// Kompakt tabell-vy
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Dokument</TableHead>
      <TableHead className="w-20">Typ</TableHead>
      <TableHead className="w-28">Datum</TableHead>
      <TableHead className="w-24 text-right">Åtgärder</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {documents.map((doc) => (
      <TableRow key={doc.id}>
        <TableCell>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{doc.title}</span>
            {doc.is_new && <Badge>Ny</Badge>}
          </div>
        </TableCell>
        ...
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Filer som skapas/ändras

| Fil | Åtgärd |
|-----|--------|
| `src/components/SubcategoryManager.tsx` | Ny |
| `src/components/CreateSubcategoryDialog.tsx` | Ny |
| `src/components/DocumentCompactView.tsx` | Ny |
| `src/components/ViewModeToggle.tsx` | Ny |
| `src/hooks/useCategories.ts` | Ändra - lägg till create/update/delete mutations |
| `src/pages/CategoryPage.tsx` | Ändra - integrera nya komponenter |

---

## Fördelar

| Funktion | Nytta |
|----------|-------|
| Fritt namngivna mappar | Anpassa struktur efter behov (Rutiner, Blanketter, osv.) |
| Inline-redigering | Snabbt ändra mappnamn utan att lämna sidan |
| Kompakt vy | Minskar scrollande med ca 60-70% |
| Vy-preferens | Användaren väljer sin föredragna vy |
| Flytta dokument | Organisera befintliga filer i nya mappar |
