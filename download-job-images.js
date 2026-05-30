const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const jobs = [
  {
    name: 'nurse.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Nurse_checks_vitals.jpg/640px-Nurse_checks_vitals.jpg'
  },
  {
    name: 'bike-rider.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Bicycle_courier_in_traffic.jpg/640px-Bicycle_courier_in_traffic.jpg'
  },
  {
    name: 'truck-driver.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Truckdriver.jpg/640px-Truckdriver.jpg'
  },
  {
    name: 'it-tech.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Two_women_operating_ENIAC.gif/640px-Two_women_operating_ENIAC.gif'
  },
  {
    name: 'construction.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/69_Fisk_IRT_line_construction.jpg/640px-69_Fisk_IRT_line_construction.jpg'
  },
  {
    name: 'healthcare.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Medical_Doctor_Showing_Certificates.jpg/640px-Medical_Doctor_Showing_Certificates.jpg'
  },
  {
    name: 'engineer.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/TVA_employee_Flickr.jpg/640px-TVA_employee_Flickr.jpg'
  },
  {
    name: 'factory.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Wolfsburg_VW-Werk_2.jpg/640px-Wolfsburg_VW-Werk_2.jpg'
  },
  {
    name: 'warehouse.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Warehouse_in_Olomouc.JPG/640px-Warehouse_in_Olomouc.JPG'
  },
  {
    name: 'agriculture.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/PivotWithDroughtStressCropSensor.jpg/640px-PivotWithDroughtStressCropSensor.jpg'
  },
  {
    name: 'mining.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Sulphur_Mine_in_Indonesia.jpg/640px-Sulphur_Mine_in_Indonesia.jpg'
  },
  {
    name: 'transport.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Cargo_Ship_P1130471.jpg/640px-Cargo_Ship_P1130471.jpg'
  },
  {
    name: 'finance.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Photos_NewYork1_032.jpg/640px-Photos_NewYork1_032.jpg'
  },
];

const dir = 'public/images/jobs';

function downloadFile(url, dest, redirectCount) {
  redirectCount = redirectCount || 0;
  if (redirectCount > 10) {
    console.log('  Too many redirects for ' + dest);
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    }, (res) => {
      console.log('  Status: ' + res.statusCode + ' for ' + path.basename(dest));

      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        const location = res.headers['location'];
        res.resume();
        console.log('  Redirecting to: ' + location);
        resolve(downloadFile(location, dest, redirectCount + 1));
        return;
      }

      if (res.statusCode !== 200) {
        res.resume();
        resolve(false);
        return;
      }

      const file = fs.createWriteStream(dest);
      let size = 0;
      res.on('data', (chunk) => { size += chunk.length; });
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('  Downloaded: ' + path.basename(dest) + ' (' + size + ' bytes)');
        resolve(size > 5000); // must be bigger than 5KB to be valid
      });
      file.on('error', () => resolve(false));
    });
    req.on('error', (e) => {
      console.log('  Network error: ' + e.message);
      resolve(false);
    });
  });
}

async function main() {
  for (const job of jobs) {
    const dest = path.join(dir, job.name);
    console.log('Downloading: ' + job.name);
    const ok = await downloadFile(job.url, dest, 0);
    if (!ok) {
      console.log('  FAILED: ' + job.name);
    }
  }
  console.log('\nAll done!');
}

main();
