# Opexa Consulting — Guide de déploiement

## 📁 Structure du projet
```
opexa/
├── index.html    ← Page principale (tout le contenu)
├── style.css     ← Design complet + responsive
├── main.js       ← Animations + formulaire
└── README.md     ← Ce guide
```

---

## 🔧 ÉTAPES À FAIRE OBLIGATOIREMENT

### 1. Formulaire de contact (Formspree)
Le formulaire envoie les messages par email via Formspree (gratuit, 50 soumissions/mois).

**Comment configurer :**
1. Allez sur https://formspree.io
2. Cliquez « New Form »
3. Mettez votre email : contact@opexa-consulting.com
4. Copiez l'ID (ex: `xpwqjkzb`)
5. Dans `main.js`, ligne ~100, remplacez :
   ```
   'https://formspree.io/f/YOUR_FORMSPREE_ID'
   ```
   par :
   ```
   'https://formspree.io/f/xpwqjkzb'
   ```

---

### 2. Informations à personnaliser dans index.html

| Quoi | Où chercher | Remplacer par |
|------|-------------|---------------|
| Téléphone | `(+216) XX XXX XXX` | Votre vrai numéro |
| Email | `contact@opexa-consulting.com` | Votre email réel |
| Adresse | `Tunis, Tunisie` | Adresse précise |
| LinkedIn | `/company/opexa-consulting` | Votre profil réel |
| Facebook | `/opexaconsulting` | Votre page réelle |
| Logos clients | Section Références | Vos vrais logos clients |
| Témoignages | Section Témoignages | Vrais témoignages clients |
| Statistiques | `data-target="15"` etc. | Vos vrais chiffres |

---

### 3. SEO — À mettre à jour dans <head>
```html
<!-- Remplacez partout opexa-consulting.com par votre vrai domaine -->
<link rel="canonical" href="https://www.opexa-consulting.com/" />
<meta property="og:url" content="https://www.opexa-consulting.com/" />
```

---

### 4. Image OG (réseaux sociaux)
Créez une image `og-image.jpg` (1200×630px) avec votre logo et slogan.
Référencée dans :
```html
<meta property="og:image" content="https://www.opexa-consulting.com/og-image.jpg" />
```

---

## 🚀 DÉPLOIEMENT GRATUIT (Recommandé : Vercel)

### Option A — Vercel (le plus simple)
1. Créez un compte sur https://vercel.com
2. Cliquez « Add New Project »
3. Importez depuis GitHub (uploadez vos fichiers d'abord sur GitHub)
4. Cliquez « Deploy » → URL gratuite fournie en 30 secondes
5. Ajoutez votre domaine dans Settings > Domains

### Option B — Netlify
1. Allez sur https://netlify.com
2. Glissez-déposez le dossier `opexa/` directement dans l'interface
3. URL gratuite générée immédiatement

### Option C — GitHub Pages (gratuit)
1. Créez un repository GitHub
2. Uploadez vos fichiers
3. Settings > Pages > Source: main branch

---

## 📊 SEO — Checklist avant lancement

- [ ] Vraie URL dans canonical + og:url
- [ ] Image og-image.jpg créée (1200×630px)
- [ ] Favicon ajouté (`<link rel="icon" href="favicon.ico">`)
- [ ] Google Search Console configuré
- [ ] Google Analytics ou Plausible installé
- [ ] Sitemap.xml créé (générez sur https://www.xml-sitemaps.com)
- [ ] robots.txt ajouté

---

## 📈 Améliorations futures recommandées

1. **Blog / Articles** — Ajouter des articles sur ISO, formation, etc. (excellent pour le SEO)
2. **Page détaillée par service** — Une page par service avec mots-clés spécifiques
3. **WhatsApp flottant** — Bouton WhatsApp en bas à gauche
4. **Google Maps** — Intégrer la carte dans la section contact
5. **Favicon** — Logo Opexa en favicon (générez sur https://realfavicongenerator.net)
6. **Images** — Ajouter des photos d'équipe, bureaux, formations (humanise la marque)
7. **Multilingue** — Version arabe pour toucher plus de clients tunisiens

---

## 💡 Formspree — Plan gratuit
- 50 soumissions/mois gratuites
- Emails livrés directement dans votre boîte
- Anti-spam inclus
- Pour plus : plan Pro à $10/mois (1000 soumissions)
