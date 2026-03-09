import { db } from '$lib/server/db';
import {product} from '$lib/server/db/schema';

export async function load() {
    //Get location of products
  const products = await db.query.product.findMany();
    
  //Debbugging purposes
  console.log('Products', products);

  //Return data 
  return {
    products
  };
}