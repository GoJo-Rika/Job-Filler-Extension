document.getElementById('fillBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true }, // allFrames ensures it works inside embedded forms (like Greenhouse/Lever)
    files: ['content.js']
  });
});