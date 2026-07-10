const { createClient } = require('@libsql/client');

const SRC_URL = 'file:/home/z/my-project/db/custom.db';
const DST_URL = 'libsql://aurexstudio-sananahmad5353.aws-eu-west-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODM2ODI2NTEsImlkIjoiMDE5ZjRiYzQtZTEwMS03NmU5LThmMTEtOGUwOTFhNmU3ZTZkIiwia2lkIjoiV1FRN0QyanNQRXZKenBldzFKdWVMdkIwZlZoOGpYekZMbUpmRkdxWnY3SSIsInJpZCI6ImYxZmE4NjA2LTIxNTktNGQ4YS04NmUzLWQ4ZGQ2YzU3MGYzZSJ9.Xq0pAjEgB9HntOqA3DxOpIu11MJFNmf-mRQB9n8UXWQKW3rY_36WbPJ1jPqNsaAw8XNtW7Qnp37QLSd4lL0qBA';

const src = createClient({ url: SRC_URL });
const dst = createClient({ url: DST_URL });

async function migrate() {
  // Drop all existing tables on destination
  const existing = await dst.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  for (const t of existing.rows) {
    await dst.execute('DROP TABLE IF EXISTS "' + t.name + '"');
    console.log('Dropped:', t.name);
  }

  // Get schema from source
  const schema = await src.execute("SELECT sql FROM sqlite_master WHERE sql IS NOT NULL ORDER BY type, name");
  console.log('\nCreating', schema.rows.length, 'schema entries...');

  for (const row of schema.rows) {
    const sql = row.sql;
    if (sql) {
      try {
        await dst.execute(sql);
        console.log('✓ Created');
      } catch (e) {
        console.error('✗ Error:', e.message.substring(0, 120));
      }
    }
  }

  // Copy data
  const tables = await src.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
  console.log('\nMigrating', tables.rows.length, 'tables...\n');

  for (const table of tables.rows) {
    const name = table.name;
    const data = await src.execute('SELECT * FROM "' + name + '"');
    if (data.rows.length === 0) { console.log(name + ': 0 rows (empty)'); continue; }

    const cols = data.columns;
    const quotedCols = cols.map(c => '"' + c + '"').join(',');
    const placeholders = cols.map(() => '?').join(',');
    const insertSql = 'INSERT INTO "' + name + '" (' + quotedCols + ') VALUES (' + placeholders + ')';

    let copied = 0;
    for (const row of data.rows) {
      const values = cols.map(c => row[c]);
      try {
        await dst.execute({ sql: insertSql, args: values });
        copied++;
      } catch (e) {
        console.error('  Row error:', e.message.substring(0, 120));
      }
    }
    console.log('✓ ' + name + ': ' + copied + '/' + data.rows.length + ' rows');
  }

  // Verify counts
  const verify = await dst.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  console.log('\n✅ Migration complete! Tables:', verify.rows.map(r => r.name).join(', '));
}

migrate().catch(e => console.error('FATAL:', e));