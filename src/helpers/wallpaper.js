const defaultCollection = require("../db/default_wallpapers.json");

function selectRandomWallpaper(collections = defaultCollection) {
  console.log(collections);

  const index =
    Math.ceil(Math.random() * collections.length) % collections.length;
  let url = collections[index].urls.full;
  url = url + "&w=2160"; // This brings down the image size to 2K
  const id = collections[index].id;
  const attributes = collections[index].attributes;

  return { id, url, attributes };
}

module.exports = { selectRandomWallpaper };
