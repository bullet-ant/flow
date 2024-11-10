import proxy from "./db/proxy.json";

export function getUnsplashCollection() {
  return new Promise(async (resolve, reject) => {
    try {
      const unsplashResponse = await fetch(`${proxy.endpoint}/wallpaper`);

      if (!unsplashResponse.ok) {
        throw new Error(`HTTP error! Status: ${unsplashResponse.status}`);
      }

      const unsplashData = await unsplashResponse.json();

      resolve(
        unsplashData.map((photo) => ({
          id: photo.id,
          url: photo.urls.full,
          attributes: {
            image: photo.links.html,
            user: {
              name: photo.user.name,
              link: photo.user.links.html,
            },
          },
        }))
      );
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      reject(error);
    }
  });
}

export async function getViewLocation(id = null) {
  if (id == false) return;
  return new Promise(async (resolve, reject) => {
    try {
      const unsplashResponse = await fetch(
        `${proxy.endpoint}/location?id=${id}`
      );

      if (!unsplashResponse.ok) {
        throw new Error(`HTTP error! Status: ${unsplashResponse.status}`);
      }

      const viewLocation = await unsplashResponse.json();

      resolve(viewLocation);
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
