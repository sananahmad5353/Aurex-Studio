const { createClient } = require('@libsql/client');

const DST_URL = 'libsql://aurexstudio-sananahmad5353.aws-eu-west-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM2ODI2NTEsImlkIjoiMDE5ZjRiYzQtZTEwMS03NmU5LThmMTEtOGUwOTFhNmU3ZTZkIiwia2lkIjoiV1FRN0QyanNQRXZKenBldzFKdWVMdkIwZlZoOGpYekZMbUpmRkdxWnY3SSIsInJpZCI6ImYxZmE4NjA2LTIxNTktNGQ4YS04NmUzLWQ4ZGQ2YzU3MGYzZSJ9.Xq0pAjEgB9HntOqA3DxOpIu11MJFNmf-mRQB9n8UXWQKW3rY_36WbPJ1jPqNsaAw8XNtW7Qnp37QLSd4lL0qBA';

const dst = createClient({ url: DST_URL });

const posts = [
  { postUrl: 'https://www.instagram.com/p/DGJqKvdS7WH/', imageUrl: '', caption: 'Digital marketing strategies that deliver results', "order": 0 },
  { postUrl: 'https://www.instagram.com/p/DGFxTjYyQ_V/', imageUrl: '', caption: 'Brand identity design for Pakistani startups', "order": 1 },
  { postUrl: 'https://www.instagram.com/p/DE_5HXjS-nQ/', imageUrl: '', caption: 'Behind the scenes at Aurex Studio', "order": 2 },
  { postUrl: 'https://www.instagram.com/p/DEtS_BxSlRC/', imageUrl: '', caption: 'Performance marketing tips for 2025', "order": 3 },
  { postUrl: 'https://www.instagram.com/p/DDnNfJxSCqZ/', imageUrl: '', caption: 'Client success story: 300% lead increase', "order": 4 },
  { postUrl: 'https://www.instagram.com/p/DDYzJiQSFep/', imageUrl: '', caption: 'Social media content that converts', "order": 5 },
  { postUrl: 'https://www.instagram.com/p/DC1FLUwSMhD/', imageUrl: '', caption: 'E-commerce growth strategies', "order": 6 },
  { postUrl: 'https://www.instagram.com/p/DBvqRWJSjZH/', imageUrl: '', caption: 'The power of consistent branding', "order": 7 },
  { postUrl: 'https://www.instagram.com/p/DBXW_kTiSaz/', imageUrl: '', caption: 'SEO tips for local businesses', "order": 8 },
  { postUrl: 'https://www.instagram.com/p/DA6LZ0GSNCV/', imageUrl: '', caption: 'Creative campaign showcase', "order": 9 },
  { postUrl: 'https://www.instagram.com/p/DAmTaYuSNCa/', imageUrl: '', caption: 'Team working on client projects', "order": 10 },
  { postUrl: 'https://www.instagram.com/p/DAbMoWQitNC/', imageUrl: '', caption: 'Website design process revealed', "order": 11 },
];

async function seedPosts() {
  const sql = 'INSERT INTO "InstagramPost" ("id","postUrl","imageUrl","caption","order","active","createdAt","updatedAt") VALUES (?,?,?,?,?,?,?,?)';
  const now = new Date().toISOString();

  let count = 0;
  for (const p of posts) {
    const id = 'post_' + Math.random().toString(36).substring(2, 15);
    try {
      await dst.execute({ sql, args: [id, p.postUrl, p.imageUrl, p.caption, p.order, 1, now, now] });
      count++;
    } catch (e) {
      console.error('Error:', e.message.substring(0, 120));
    }
  }
  console.log('Inserted ' + count + ' Instagram posts');

  // Verify
  const r = await dst.execute('SELECT COUNT(*) as c FROM "InstagramPost"');
  console.log('Total InstagramPost rows:', r.rows[0].c);
}

seedPosts().catch(e => console.error('FATAL:', e));