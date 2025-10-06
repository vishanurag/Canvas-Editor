/**
 * Keyboard Shortcuts Handler for Canvas Editor
 * Provides keyboard shortcuts for tools and actions
 */

(function() {
    'use strict';

    // Keyboard shortcuts configuration
    const shortcuts = {
        // Tools
        'p': { id: 'pencil', name: 'Pencil' },
        'm': { id: 'marker', name: 'Marker' },
        'e': { id: 'eraser', name: 'Eraser' },
        'l': { id: 'line', name: 'Line' },
        'r': { id: 'rectangle', name: 'Rectangle' },
        'c': { id: 'circle', name: 'Circle' },
        't': { id: 'text', name: 'Text' },
        'g': { id: 'grid', name: 'Toggle Grid' },
    };

    const ctrlShortcuts = {
        'z': { id: 'undo', name: 'Undo' },
        'y': { id: 'redo', name: 'Redo' },
        'delete': { id: 'clear', name: 'Clear Canvas' },
    };

    /**
     * Initialize keyboard shortcuts
     */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', handleKeyPress);
        console.log('✅ Keyboard shortcuts initialized');
    }

    /**
     * Handle key press events
     */
    function handleKeyPress(e) {
        // Ignore shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' || 
            e.target.isContentEditable) {
            return;
        }

        const key = e.key.toLowerCase();
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;

        // Handle Ctrl/Cmd + Key shortcuts
        if (isCtrlOrCmd && ctrlShortcuts[key]) {
            e.preventDefault();
            const shortcut = ctrlShortcuts[key];
            const button = document.getElementById(shortcut.id);
            
            if (button) {
                button.click();
                showShortcutFeedback(shortcut.name);
            }
            return;
        }

        // Handle single key shortcuts
        if (!isCtrlOrCmd && shortcuts[key]) {
            e.preventDefault();
            const shortcut = shortcuts[key];
            const button = document.getElementById(shortcut.id);
            
            if (button) {
                button.click();
                showShortcutFeedback(shortcut.name);
            }
        }

        // Handle Delete key for clear
        if (key === 'delete' && !isCtrlOrCmd) {
            e.preventDefault();
            const button = document.getElementById('clear');
            if (button && confirm('Clear the canvas?')) {
                button.click();
                showShortcutFeedback('Clear Canvas');
            }
        }
    }

    /**
     * Show visual feedback when a shortcut is used
     */
    function showShortcutFeedback(actionName) {
        // Remove existing feedback
        const existing = document.getElementById('shortcut-feedback');
        if (existing) {
            existing.remove();
        }

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.id = 'shortcut-feedback';
        feedback.textContent = actionName;
        feedback.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            animation: slideInFade 0.3s ease-out;
        `;

        document.body.appendChild(feedback);

        // Remove after animation
        setTimeout(() => {
            feedback.style.animation = 'slideOutFade 0.3s ease-out';
            setTimeout(() => feedback.remove(), 300);
        }, 1500);
    }

    /**
     * Get all available shortcuts as formatted text
     */
    function getShortcutsHelp() {
        let help = 'KEYBOARD SHORTCUTS:\n\n';
        help += 'Tools:\n';
        for (const [key, shortcut] of Object.entries(shortcuts)) {
            help += `  ${key.toUpperCase()} - ${shortcut.name}\n`;
        }
        help += '\nActions:\n';
        for (const [key, shortcut] of Object.entries(ctrlShortcuts)) {
            help += `  Ctrl/Cmd + ${key.toUpperCase()} - ${shortcut.name}\n`;
        }
        help += '  Delete - Clear Canvas\n';
        return help;
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFade {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutFade {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(20px);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initKeyboardShortcuts);
    } else {
        initKeyboardShortcuts();
    }

    // Expose helper function globally
    window.getKeyboardShortcuts = getShortcutsHelp;

})();
