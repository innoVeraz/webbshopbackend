import { db } from "./db";


async function fixDescriptions() {
  try {
    await db.query(
      `UPDATE products SET description = 'Lätta och responsiva löparskor för maxad prestation' WHERE id = 1`
    );
    await db.query(
      `UPDATE products SET description = 'Robusta trailskor för tuff terräng och långa rundor' WHERE id = 2`
    );
    await db.query(
      `UPDATE products SET description = 'Stilrena och bekväma sneakers för vardagsbruk' WHERE id = 3`
    );

    console.log('✅ Produktbeskrivningar uppdaterade med åäö!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Misslyckades med att uppdatera:', error);
    process.exit(1);
  }
}

fixDescriptions();
