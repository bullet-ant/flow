import proxy from "./proxy.json";
function getWallpaperIndex(urls = []) {
  const today = new Date();
  const hours = today.getHours();
  if (urls.length)
    return {
      external: true,
      index: Math.ceil(Math.random() * 10) % urls.length,
    };

  return {
    external: false,
    index: hours < 16 ? 0 : 1,
  };
}

export function getUnsplashCollection(collectionId) {
  return new Promise(async (resolve, reject) => {
    try {
      const unsplashResponse = await fetch(
        `${proxy.endpoint}/wallpaper?collection_id=${collectionId}`
      );

      if (!unsplashResponse.ok) {
        throw new Error(`HTTP error! Status: ${unsplashResponse.status}`);
      }

      const unsplashData = await unsplashResponse.json();

      resolve(unsplashData.map((photo) => photo.urls.full));
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      reject(error);
    }
  });
}

export function createSolidBackgroundImage(color) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL();
}

export default getWallpaperIndex;
