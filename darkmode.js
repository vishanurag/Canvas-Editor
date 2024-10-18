const checkbox = document.getElementById('checkbox')
const modeLabel = document.getElementById('mode-label')

// Check if dark mode is already enabled
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
    checkbox.checked = true
    modeLabel.textContent = 'Dark Mode'
}

// Add event listener for toggle switch
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
        modeLabel.textContent = 'Dark Mode'
    } else {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
        modeLabel.textContent = 'Light Mode'
    }
})
