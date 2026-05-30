const https = require('https');
const fs = require('fs');
const path = require('path');

function download(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filename);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Successfully downloaded ${url} to ${filename}`);
          resolve(true);
        });
      } else {
        console.log(`Failed to download ${url}: status code ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`Error downloading ${url}: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  const publicDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Download Everest Logo
  await download('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b9d0d599a7a3d9665dafc5/49ad3d4fa_Untitleddesign4.png', path.join(publicDir, 'everest_logo.png'));

  // Download APSO Logo
  await download('https://apso.org.za/images/APSO-LOGO.png', path.join(publicDir, 'apso_logo.png'));

  // Test UiTM paths
  const uitmPaths = [
    'https://en.uitm.edu.eu/templates/masterbootstrap/images/logo.png',
    'https://en.uitm.edu.eu/images/logo.png',
    'https://wsiz.edu.pl/wp-content/themes/wsiz/images/logo.png',
    'https://wsiz.edu.pl/wp-content/themes/wsiz/img/logo.png',
    'https://wsiz.edu.pl/wp-content/uploads/2020/09/Logo_WSIiZ_EN.png',
    'https://wsiz.edu.pl/wp-content/uploads/2020/09/Logo_WSIiZ_PL.png',
    'https://sunrise-alliance.eu/wp-content/uploads/2023/10/UITM-rzeszow-logo.png'
  ];

  let uitmSuccess = false;
  for (const pathUrl of uitmPaths) {
    console.log(`Trying ${pathUrl}...`);
    const success = await download(pathUrl, path.join(publicDir, 'uitm_logo.png'));
    if (success) {
      uitmSuccess = true;
      break;
    }
  }

  if (!uitmSuccess) {
    console.log('Could not download official UiTM logo from typical paths, creating custom fallback image...');
    // If all fail, we will create a high-quality fallback logo using dynamic canvas or SVG!
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80">
      <rect width="200" height="80" rx="10" fill="#0B1D3A"/>
      <text x="25" y="45" font-family="Outfit, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF">UITM</text>
      <text x="25" y="62" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#C9A44B">WSIiZ Rzeszow</text>
      <circle cx="150" cy="40" r="15" fill="#1D7A7A" opacity="0.8"/>
      <circle cx="160" cy="45" r="10" fill="#C9A44B" opacity="0.8"/>
    </svg>`;
    fs.writeFileSync(path.join(publicDir, 'uitm_logo.svg'), fallbackSvg);
    console.log('Created fallback uitm_logo.svg');
  }
}

run();
