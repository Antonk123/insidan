

## Intranet Document Portal

A modern, Swedish-language intranet focused on making documents easy to find through clear organization and smart navigation.

---

### Phase 1: Core Structure (Start Simple)

**Homepage Dashboard**
- Clean welcome page with your company branding
- Safety counter widget showing "Dagar utan olyckor" (days without accidents) - admins can update this
- Quick links section with most-used resources (VLS, Projekttavla, Telefonlista, etc.)
- "Senaste dokument" (Recent documents) feed showing newly added or updated items

**Category System**
- Main categories organized just like your current process structure (Huvudprocesser & Stödprocesser)
- Each category shows its description and leads to a document list
- Clear subcategories within each area (like Rutiner, Blanketter, etc.)
- Easy browsing with breadcrumb navigation

**Document Pages**
- Each category page lists all documents in that area
- Documents show title, description, document type (PDF, Excel, etc.), and where it links (local or SharePoint)
- Visual indicators for document types (PDF icon, Excel icon, external link icon)

---

### Phase 2: Search & Access

**Search Functionality**
- Search bar on every page
- Search across document titles, descriptions, and tags
- Filter results by category or document type

**User Authentication**
- Login system for employees (email/password)
- Public pages accessible without login
- Protected content only visible to logged-in users
- Admin role for managing content

---

### Phase 3: Admin Features

**Document Management (Admins Only)**
- Add new documents with title, description, category, and link
- Edit or remove existing documents
- Set documents as public or internal-only
- Mark documents as "new" to appear in recent feed

**Dashboard Management**
- Update the safety counter
- Manage quick links on homepage
- Organize categories and subcategories

---

### Technical Approach

- **Backend**: Lovable Cloud for database and authentication
- **Database**: Store document metadata, categories, user accounts, and settings
- **File Storage**: Links point to your existing SharePoint/local storage (no need to migrate files)
- **Language**: All interface text in Swedish

This gives you a clean, organized document portal that grows with your company while keeping your existing document storage in place.

