export async function saveName(name) {
  chrome.storage.local.set({ name: name });
}

export async function getName() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["name"], (result) => {
      const name = result.name || null;
      resolve(name);
    });
  });
}
