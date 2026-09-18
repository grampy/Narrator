export function handleLayout() {
    // --- Vertical (Column) Resize Logic ---
    const leftPanel = document.getElementById('left-panel');
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
}
