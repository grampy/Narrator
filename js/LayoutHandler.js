
import { Trees, renderTree } from './index.js';

export function handleLayout() {
    // --- Vertical (Column) Resize Logic ---
    const leftPanel = document.getElementById('left-panel');

    leftPanel.style.display = 'none';  // Hide left panel by default
    
    const gutterCol = document.getElementById('gutter-col');
    let isColDragging = false;
    globalThis.isColDragging = isColDragging;

    gutterCol.addEventListener('mousedown', (e) => {
      isColDragging = true;
      gutterCol.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection
    });

    // --- Horizontal (Row) Resize Logic ---
    const rightTop = document.getElementById('right-top');
    const rightContainer = document.getElementById('right-container');
    const gutterRow = document.getElementById('gutter-row');
    let isRowDragging = false;

    gutterRow.addEventListener('mousedown', (e) => {
      isRowDragging = true;
      gutterRow.classList.add('dragging');
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    });

    // --- Shared MouseMove Listener ---
    document.addEventListener('mousemove', (e) => {
      if (isColDragging) {
        // Calculate new width relative to window/container
        const newWidth = e.clientX;
        const minWidth = 150;
        const maxWidth = window.innerWidth * 0.6; // Max 60% of screen

        if (newWidth >= minWidth && newWidth <= maxWidth) {
          leftPanel.style.width = `${newWidth}px`;
        }
      }

      if (isRowDragging) {
        // Calculate top panel height relative to right-container offset
        const containerTop = rightContainer.getBoundingClientRect().top;
        const newHeight = e.clientY - containerTop;
        const minHeight = 100;
        const maxHeight = rightContainer.clientHeight - 100;

        if (newHeight >= minHeight && newHeight <= maxHeight) {
          rightTop.style.height = `${newHeight}px`;
        }
      }
    });

    // --- Shared MouseUp Listener ---
    document.addEventListener('mouseup', () => {
      if (isColDragging || isRowDragging) {
        isColDragging = false;
        isRowDragging = false;
        gutterCol.classList.remove('dragging');
        gutterRow.classList.remove('dragging');
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    });

    // Setup expand/collapse all buttons (only once)
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    
    const hideIndexBtn = document.getElementById('hideIndexBtn');

    expandAllBtn.onclick = () => {
      document.querySelectorAll('.letter-header').forEach(header => {
        header.classList.remove('collapsed');
      });
      document.querySelectorAll('.last-name-header').forEach(header => {
        header.classList.remove('collapsed');
      });
    };

    collapseAllBtn.onclick = () => {
      document.querySelectorAll('.letter-header').forEach(header => {
        header.classList.add('collapsed');
      });
      document.querySelectorAll('.last-name-header').forEach(header => {
        header.classList.add('collapsed');
      });
    };
    
    hideIndexBtn.onclick = () => {
      document.getElementById('left-panel').style.display = 'none';
    };

    // Hamburger menu toggle
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');

    hamburgerMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
      }
    });

    // Handle menu item clicks
    dropdownMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const type = link.getAttribute('data-type');
        dropdownMenu.classList.remove('show');
        document.getElementById('left-panel').style.display = 'block';

        // Render appropriate index based on type
        Trees[type] ? renderTree(Trees[type], '', type) : 
        alert(`Index for '${type}' coming soon!`);
      });
    });

}
