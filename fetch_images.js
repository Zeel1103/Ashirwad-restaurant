const fs = require('fs');
const https = require('https');
const path = require('path');

const fetchJson = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'AntigravityBot/1.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(JSON.parse(data)));
  }).on('error', reject);
});

const downloadFile = (url, filepath) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      return downloadFile(res.headers.location, filepath).then(resolve).catch(reject);
    }
    const file = fs.createWriteStream(filepath);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      resolve();
    });
  }).on('error', reject);
});

async function run() {
  const items = [
    { name: 'garlic-naan', query: 'Naan' },
    { name: 'laccha-paratha', query: 'Paratha' },
    { name: 'masala-chaas', query: 'Chaas' },
    { name: 'fresh-lime-soda', query: 'Lime_soda' },
    { name: 'masala-tea', query: 'Masala_chai' }
  ];

  for (const item of items) {
    try {
      console.log(`Fetching image for ${item.query}...`);
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${item.query}&pithumbsize=800&format=json`;
      const data = await fetchJson(searchUrl);
      
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        const imageUrl = pages[pageId].thumbnail.source;
        console.log(`Downloading ${imageUrl} to ${item.name}.png`);
        await downloadFile(imageUrl, path.join(__dirname, 'public', 'images', `${item.name}.png`));
      } else {
        console.log(`No image found for ${item.query}`);
      }
    } catch (e) {
      console.error(`Failed to fetch ${item.query}:`, e.message);
    }
  }
}

run();
