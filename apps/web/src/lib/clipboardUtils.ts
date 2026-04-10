// Requirement: Robust clipboard copy with multiple fallbacks for all browser contexts
// Approach: Three-tier fallback — ClipboardItem Blob → writeText → textarea execCommand
// Alternatives:
//   - Single writeText: Rejected — fails in some PWA webview contexts
//   - External clipboard library: Rejected — adds dependency for a small utility
// Source: glow-props DEBUG_SYSTEM.md pattern

export async function copyToClipboard(text: string): Promise<boolean> {
  // Method 1: ClipboardItem Blob — works in contexts where writeText is blocked
  try {
    const blob = new Blob([text], { type: 'text/plain' })
    await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })])
    return true
  } catch { /* fall through */ }

  // Method 2: writeText
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch { /* fall through */ }

  // Method 3: Textarea fallback for mobile PWA webviews
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  } catch { return false }
}
