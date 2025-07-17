# Cards-Galore

I have created a bunch of handy cards, they are all still in development.
Feel free to install it, if you dont like/need it, simply uninstall

## Cards

Tabs card <img width="2042" height="190" alt="image" src="https://github.com/user-attachments/assets/9652aaf2-5dfb-4437-816d-f7bf67dfe6c8" />



## Installation



<details>
<summary>HACS (Advanced)</summary>
1. Open HACS in your Home Assistant instance
2. Click the three dots in the top right corner
3. Select "Custom repositories"
4. Add `Dangerdangerau/Cards-Galore` as a repository
5. Set category to "Dashboard"
6. Click "Add"
7. Search for "Cards Galore"
8. Install it and reload your browser
</details>

## Configuration
### Tabs Card

#### Adding the Card

1. Go to **Home Assistant Dashboard**.
2. Click the three dots menu (⋮) → **Edit Dashboard** → **Add Card**.
3. Search for **“Custom Tabs Card”** in the list.
4. Select it to open the configuration editor.

---

#### 🛠 Configuration Options

| Option             | Description                                              |
|--------------------|----------------------------------------------------------|
| **Selected Tab**   | The index (starting from 0) of the tab selected by default. |
| **Navbar Mode**    | Enable for full-width tabs styled like a navbar.         |
| **Tabs**           | List of tabs with name, path, and icon for each tab.     |

---

#### ➕ Adding Tabs

In the editor:  
1. Click the **＋ button** to add a new tab.  
2. Fill in:  
   - **Name**: Label for the tab (e.g., `Home`)  
   - **Path**: URL path of the view or page (e.g., `/lovelace/home`)  
   - **Icon**: Material Design Icon name (e.g., `mdi:home`)  

---

#### ✏️ Editing Tabs

Simply change the name, path, or icon in the provided textboxes. Changes apply immediately.

---

#### ❌ Removing Tabs

Click the ✖ next to a tab entry to remove it.

---

#### 🌟 Tips

- **Path** should match the URL of the view or page you’re linking to.  
- Use **Material Design Icons** for the icon field (e.g., `mdi:home`, `mdi:flash`).  
- Enable **Navbar Mode** for tabs to span the full width of the card.
